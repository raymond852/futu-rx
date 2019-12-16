const path = require("path");
const protoLoader = require('./helper/protoLoader');
const requestProcessor = require('./helper/requestProcessor');
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;

const protoPath = path.resolve(__dirname, "../pb/Qot_GetRT.proto");
const [Request, Response] = protoLoader.load(protoPath);

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

      return requestProcessor
        .process(self, protoId, Request, Response, c2sPayload, {
          func: "qotGetRT",
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
