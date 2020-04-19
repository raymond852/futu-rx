const path = require("path");
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;
const protoLoader = require('./helper/protoLoader');

const protoPath = path.resolve(__dirname, "../pb/Qot_Sub.proto");
const [Request, Response] = protoLoader.load(protoPath);


// https://futunnopen.github.io/futu-api-doc/protocol/quote_protocol.html#qot-sub-proto-3001
module.exports = function (securityList, enumQotSubTypeList, enumQotRehabTypeList, isSubOrUnSub, isRegOrUnRegPush, isFirstPush, isUnsubAll) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3001";
      const c2sPayload = {
        securityList: securityList,
        subTypeList: enumQotSubTypeList,
        isSubOrUnSub: isSubOrUnSub,
        regPushRehabTypeList: enumQotRehabTypeList
      };

      if (isRegOrUnRegPush != undefined) {
        c2sPayload.isRegOrUnRegPush = isRegOrUnRegPush;
      }

      if (isFirstPush != undefined) {
        c2sPayload.isFirstPush = isFirstPush;
      }

      if (isUnsubAll != undefined) {
        c2sPayload.isUnsubAll = isUnsubAll;
      }

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: 'Qot_Sub',
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
