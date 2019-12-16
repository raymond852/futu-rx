const Connection = require("./connection");
const util = require("util");
const net = require("net");
const rxjs = require("rxjs");
const Observable = rxjs.Observable;
const defer = rxjs.defer;
const mergeMap = require("rxjs/operators").mergeMap;
const first = require("rxjs/operators").first;
const of = rxjs.of;
const throwError = rxjs.throwError;

function SocketConnection(host, port) {
  Connection.call(this, host, port);

  this._socket = new net.Socket();

  const self = this;

  this._socket.on("connect", function () {
    self._connectionStatus = CONNECTION_STATUS.Connected;
    self._connectionStatusSubject.next(self._connectionStatus);
  });

  this._socket.on("close", function () {
    self._connectionStatus = CONNECTION_STATUS.Disconnected;
    self._connectionStatusSubject.next(self._connectionStatus);
  });

  this._socket.on("error", function (error) {
    self._connectionErrorSubject.next(error);
  });

  this._socket.on("data", function (data) {
    self._dataRecvSubject.next(data);
  });
}

util.inherits(SocketConnection, Connection);

const CONNECTION_STATUS = Connection.CONNECTION_STATUS;
SocketConnection.CONNECTION_STATUS = CONNECTION_STATUS;
SocketConnection.connectStatusDescription = Connection.connectStatusDescription;

SocketConnection.prototype.connect = function () {
  const self = this;
  if (self._connectionStatus == CONNECTION_STATUS.Connected) {
    return of(self);
  }
  if (self._connectionStatus == CONNECTION_STATUS.Connecting) {
    return self.connectionStatus().pipe(
      first(),
      mergeMap(function (status) {
        if (status == CONNECTION_STATUS.Connected) {
          return of(self);
        } else {
          return throwError("connect failed");
        }
      }));
  }

  self._connectionStatus = CONNECTION_STATUS.Connecting;
  self._connectionStatusSubject.next(self._connectionStatus);

  return defer(() =>
    Observable.create(function (observer) {
      self._socket.once('error', (err) => {
        observer.error(err);
      });
      self._socket.connect(self._port, self._host, function () {
        observer.next(self);
        observer.complete();
      });
    })
  );
};

SocketConnection.prototype.disconnect = function () {
  const self = this;
  if (self._connectionStatus == CONNECTION_STATUS.Disconnected) {
    return of(self);
  }
  if (self._connectionStatus == CONNECTION_STATUS.Disconnecting) {
    return self.connectionStatus().pipe(
      first(),
      mergeMap(function (status) {
        if (status == CONNECTION_STATUS.Disconnected) {
          return of(self);
        } else {
          return throwError("disconnect failed");
        }
      })
    );
  }

  self._connectionStatus = CONNECTION_STATUS.Disconnecting;
  self._connectionStatusSubject.next(self._connectionStatus);

  return defer(() =>
    Observable.create(function (observer) {
      self._socket.end();
      observer.next(self);
      observer.complete();
    }));
};

SocketConnection.prototype.sendData = function (dataBuf) {
  const self = this;
  return defer(() =>
    Observable.create(function (observer) {
      self._socket.write(dataBuf, function (err) {
        if (err) {
          observer.error(err);
        } else {
          self._dataSentSubject.next(dataBuf);
          observer.next(self);
        }
      });
    }));
};

module.exports = SocketConnection;
