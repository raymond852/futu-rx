const path = require("path");
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;
const protoLoader = require('./helper/protoLoader');

const protoPath = path.resolve(__dirname, "../pb/Qot_GetStaticInfo.proto");
const [
  Request,
  Response
] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/quote_protocol.html#qot-getstaticinfo-proto-3202
module.exports = function (securityList, enumQotSecurityType, enumQotTradeMarket) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3202";
      const c2sPayload = {
        securityList: securityList,
      };

      if (enumQotSecurityType != undefined) {
        c2sPayload.secType = enumQotSecurityType;
      }

      if (enumQotTradeMarket != undefined) {
        c2sPayload.market = enumQotTradeMarket;
      }

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: 'Qot_GetStaticInfo',
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
