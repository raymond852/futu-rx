const path = require("path");
const protoLoader = require('./helper/protoLoader');
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;

const protoPath = path.resolve(__dirname, "../pb/Qot_GetRT.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/quote_protocol.html#qot-getrt-proto-3008
module.exports = function (enumQotMarket, secCode) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3008";
      const c2sPayload = {
        security: {
          market: enumQotMarket,
          code: secCode,
        }
      };

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: "Qot_GetRT",
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
