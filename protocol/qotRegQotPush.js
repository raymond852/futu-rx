const path = require("path");
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;
const protoLoader = require('./helper/protoLoader');

const protoPath = path.resolve(__dirname, "../pb/Qot_RegQotPush.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/quote_protocol.html#qot-regqotpush-proto-3002
module.exports = function (securityList, enumQotSubTypeList, enumQotRehabTypeList, isRegOrUnReg, isFirstPush) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3002";
      const c2sPayload = {
        securityList: securityList,
        subTypeListL: enumQotSubTypeList,
        regPushRehabTypeList: enumQotRehabTypeList,
        isRegOrUnReg: isRegOrUnReg
      };

      if (isFirstPush != undefined) {
        c2sPayload.isFirstPush = isFirstPush;
      }

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: 'Qot_RegQotPush',
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
