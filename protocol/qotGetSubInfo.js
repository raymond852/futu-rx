const path = require("path");
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;
const protoLoader = require('./helper/protoLoader');

const protoPath = path.resolve(__dirname, "../pb/Qot_GetSubInfo.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/quote_protocol.html#qot-getsubinfo-proto-3003
module.exports = function (isReqAllConn) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3003";

      const c2sPayload = {};

      if (isReqAllConn != undefined) {
        c2sPayload.isReqAllConn = isReqAllConn;
      }

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: 'Qot_GetSubInfo',
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
