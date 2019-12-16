const path = require("path");
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;
const protoLoader = require('./helper/protoLoader');
const requestProcessor = require('./helper/requestProcessor');

const protoPath = path.resolve(__dirname, "../pb/Qot_Sub.proto");
const [
  Request,
  Response
] = protoLoader.load(protoPath);

module.exports = function (securityList, enumQotSubTypeList, enumQotRehabTypeList, isSub, isReg, isFirstPush, isUnsubAll) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3001";
      const c2sPayload = {
        securityList: securityList,
        subTypeListL: enumQotSubTypeList,
        isSubOrUnSub: isSub,
        regPushRehabTypeList: enumQotRehabTypeList
      };

      if (isReg != undefined) {
        c2sPayload.isRegOrUnRegPush = isReg;
      }

      if (isFirstPush != undefined) {
        c2sPayload.isFirstPush = isFirstPush;
      }

      if (isUnsubAll != undefined) {
        c2sPayload.isUnsubAll = isUnsubAll;
      }

      return requestProcessor
        .process(self, protoId, Request, Response, c2sPayload, {
          func: 'qotSub',
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
