const SocketConnection = require("./socketConnection");
const nullcheck = require("../util/nullcheck");
const rxjs = require("rxjs");
const util = require('util');
const mergeMap = require("rxjs/operators").mergeMap;
const filter = require('rxjs/operators').filter;
const timeout = require('rxjs/operators').timeout;
const first = require('rxjs/operators').first;
const catchError = require('rxjs/operators').catchError;
const defer = rxjs.defer;
const zip = rxjs.zip;
const of = rxjs.of;
const throwError = rxjs.throwError;

const MAX_REQ_ID = Math.pow(2, 31) - 1;

function Client(clientConfig) {
  if (typeof this === "function") return new Client(clientConfig);

  nullcheck.ensureNotNull(clientConfig, "missing client config");
  nullcheck.ensureNotNull(clientConfig.host, "host cannot be null");
  nullcheck.ensureNotNull(clientConfig.port, "port cannot be null");

  this._packetTimeoutMs = clientConfig.timeoutMs || 10000;
  this._connection = new SocketConnection(clientConfig.host, clientConfig.port);
}

Client.InvocationContext = function ClientInvocationContext(requestId, request, response, callerContext) {
  this.requestId = requestId
  this.request = request;
  this.response = response;
  this.callerContext = callerContext;
}

Client.InvocationContext.prototype.toString = function () {
  return JSON.stringify(this);
}

Client.Error = function ClientError(requestId, request, response, callerContext, error) {
  Client.InvocationContext.call(this, requestId, request, response, callerContext);
  this.stack = error.stack;
}

util.inherits(Client.Error, Client.InvocationContext);

Client.prototype.dataSent = function () {
  return this._connection.dataSent();
};

Client.prototype.dataRecv = function () {
  return this._connection.dataRecv();
};

Client.prototype.nextRequestId = function () {
  var requestId = this._requestId;
  if (!requestId) {
    requestId = 1;
  } else {
    requestId += 1;
  }
  if (requestId > MAX_REQ_ID) {
    requestId = 1;
  }
  this._requestId = requestId;
  return requestId;
}

Client.prototype.currentRequestId = function () {
  return this._requestId
}

Client.prototype.connectionStatus = function () {
  return this._connection.connectionStatus();
}

Client.prototype.sendRequestAndHandleResponse = function (packetReqId, funcReqIdLookUp, req, reqSerializer, resDeserializer, timeoutMs, callerContext) {
  const recvDataObservable = this._connection
    .dataRecv()
    .pipe(
      filter((buffer) => funcReqIdLookUp(buffer) == packetReqId),
      first(),
      mergeMap(buffer => {
        try {
          var respPaylod = resDeserializer(buffer);
          return of(respPaylod);
        } catch (e) {
          return throwError(e);
        }
      })
    );

  const sendDataObservable = this._connection.connect().pipe(
    mergeMap(connection => {
      return connection.sendData(reqSerializer(req));
    })
  );

  return defer(() => {
    return zip(recvDataObservable, sendDataObservable, (resp, _) => {
      return new Client.InvocationContext(packetReqId, req, resp, callerContext);
    }).pipe(timeout(timeoutMs), catchError(error => {
      return throwError(new Client.Error(packetReqId, req, null, callerContext, error))
    }));
  });
};

module.exports = Client;
