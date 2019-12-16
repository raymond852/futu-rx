const path = require("path");
const protoLoader = require('./helper/protoLoader');
const requestProcessor = require('./helper/requestProcessor');
const nullcheck = require('../util/nullcheck');
const rxjs = require('rxjs');
const defer = rxjs.defer;
const throwError = rxjs.throwError;

const protoPath = path.resolve(__dirname, "../pb/Trd_GetHistoryOrderList.proto");
const [Request, Response] = protoLoader.load(protoPath);

module.exports = function (enumTrdEnv, enumTrdMarket, beginTimeUnixMs, endTimeUnixMs, arrEnumTrdOrderStatus) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);
  return defer(() => {
    const protoId = "2221";

    if (nullcheck.isNull(self._protocolStateObj['accList'])) {
      return throwError("please call client.trdGetAccList first");
    }

    var account = self._protocolStateObj['accList'].filter((accInfo) => {
      return accInfo['trdMarketAuthList'] &&
        accInfo['trdMarketAuthList'].length > 0 &&
        accInfo['trdMarketAuthList'].indexOf(enumTrdMarket) >= 0 &&
        accInfo['trdEnv'] &&
        accInfo['trdEnv'] == enumTrdEnv;
    });

    if (account.length == 0) {
      return throwError(`cannot find any trade account with account list ${self._protocolStateObj['accList']}`);
    }

    const tzoffset = (new Date()).getTimezoneOffset() * 60000;

    const beginDate = new Date(beginTimeUnixMs - tzoffset);
    const endDate = new Date(endTimeUnixMs - tzoffset);


    var c2sPayload = {
      header: {
        trdEnv: enumTrdEnv,
        accID: account[0]['accID'],
        trdMarket: enumTrdMarket
      },
      filterConditions: {
        beginTime: beginDate.toISOString().slice(0, 10),
        endTime: endDate.toISOString().slice(0, 10)
      },
      filterStatusList: arrEnumTrdOrderStatus
    };

    return requestProcessor
      .process(self, protoId, Request, Response, c2sPayload, {
        func: "trdGetHistoryOrderList",
        args: args
      });
  });
}
