const path = require("path");
const protoLoader = require('./helper/protoLoader');
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;

const protoPath = path.resolve(__dirname, "../pb/Qot_GetKL.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/quote_protocol.html#qot-getkl-proto-3006k
module.exports = function (enumQotRehabType, enumQotKLType, enumQotMarket, code, count) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3006";
      const c2sPayload = {
        rehabType: enumQotRehabType,
        klType: enumQotKLType,
        security: {
          market: enumQotMarket,
          code: code,
        },
        reqNum: count
      };

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: "Qot_GetKL",
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
