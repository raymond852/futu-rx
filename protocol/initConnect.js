const path = require("path");
const uuid = require('../util/uuid');
const protoLoader = require('./helper/protoLoader');
const header = require('./helper/header');
const tap = require('rxjs/operators').tap;

const protoPath = path.resolve(__dirname, "../pb/InitConnect.proto");
const [Request, Response] = protoLoader.load(protoPath);

module.exports = function () {
  const protoId = "1001";
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  const c2sPayload = {
    clientVer: 220,
    clientID: uuid.v4(),
    recvNotify: true,
    packetEncAlgo: -1,
    pushProtoFmt: 0
  };

  self
    .dataRecv()
    .subscribe(
      (respBuf) => {
        var h = header.parse(respBuf)
      }
    );

  return self._requestProcessor
    .process(protoId, Request, Response, c2sPayload, {
      func: "InitConnect",
      args: args
    })
    .pipe(
      tap((context) => {
        const response = context.response;
        self._protocolStateObj["connID"] = response['s2c']['connID']
        self._protocolStateObj['aesKey'] = response['s2c']['connAESKey'];
        self._protocolStateObj['keepAliveInterval'] = response['s2c']['keepAliveInterval'];
        self._protocolStateSubject.next(new Set(["aesKey", "keepAliveInterval"]));
      })
    );
}
