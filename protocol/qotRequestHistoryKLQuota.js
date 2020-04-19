const path = require("path");
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;
const protoLoader = require('./helper/protoLoader');

const protoPath = path.resolve(__dirname, "../pb/Qot_RequestHistoryKLQuota.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/quote_protocol.html#qot-requesthistoryklquota-proto-3104k
module.exports = function (isGetDetail) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3104";
      const c2sPayload = {
        bGetDetail: isGetDetail,
      };

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: 'Qot_RequestHistoryKLQuota',
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
