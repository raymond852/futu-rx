const path = require("path");
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;
const protoLoader = require('./helper/protoLoader');

const protoPath = path.resolve(__dirname, "../pb/Qot_RequestHistoryKL.proto");
const [Request, Response] = protoLoader.load(protoPath);

module.exports = function (security, enumQotRehabType, enumQotKLType, beginTime, endTime, flagEnumKLFields, nextReqKey, maxAckKLNum) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3103";
      const c2sPayload = {
        security: security,
        rehabType: enumQotRehabType,
        klType: enumQotKLType,
        beginTime: beginTime,
        endTime: endTime
      };

      if (flagEnumKLFields != undefined) {
        c2sPayload.needKLFieldsFlag = flagEnumKLFields
      }
      if (nextReqKey != undefined) {
        c2sPayload.nextReqKey = nextReqKey
      }
      if (maxAckKLNum != undefined) {
        c2sPayload.maxAckKLNum = maxAckKLNum;
      }

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: 'Qot_RequestHistoryKL',
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
