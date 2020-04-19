const path = require("path");
const protoLoader = require('./helper/protoLoader');
const rxjs = require('rxjs');
const defer = rxjs.defer;
const throwError = rxjs.throwError;

const protoPath = path.resolve(__dirname, "../pb/Trd_GetPositionList.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/trade_protocol.html#trd-getpositionlist-proto-2102
module.exports = function (enumTrdEnv, enumTrdMarket, codeList, idList, beginTimeStr, endTimeStr, filterPLRatioMin, filterPLRatioMax, refreshCache) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);
  return defer(() => {
    const protoId = "2102";

    var accounts = self._protocolStateObj['accList'].filter((accInfo) => {
      return accInfo['trdMarketAuthList'] &&
        accInfo['trdMarketAuthList'].length > 0 &&
        accInfo['trdMarketAuthList'].indexOf(enumTrdMarket) >= 0 &&
        accInfo['trdEnv'] &&
        accInfo['trdEnv'] == enumTrdEnv;
    });

    if (accounts.length == 0) {
      throwError(`cannot find account matching enumTrdEnv=${enumTrdEnv} enumTrdMarket=${enumTrdMarket} accList=${self._protocolStateObj['accList']}`)
    }

    var c2sPayload = {
      header: {
        trdEnv: enumTrdEnv,
        accID: accounts[0]['accID'],
        trdMarket: enumTrdMarket
      },
    };

    var filterConditions = {}
    var isNotEmpty
    if (codeList != undefined) {
      filterConditions["codeList"] = codeList;
      isNotEmpty = true;
    }
    if (idList != undefined) {
      filterConditions["idList"] = idList;
      isNotEmpty = true;
    }
    if (beginTimeStr != undefined) {
      filterConditions["beginTime"] = beginTimeStr;
      isNotEmpty = true;
    }
    if (endTimeStr != undefined) {
      filterConditions["endTime"] = endTimeStr;
      isNotEmpty = true;
    }
    if (isNotEmpty) {
      c2sPayload["filterConditions"] = filterConditions;
    }

    if (filterPLRatioMax != undefined) {
      c2sPayload["filterPLRatioMax"] = filterPLRatioMax;
    }
    if (filterPLRatioMin != undefined) {
      c2sPayload["filterPLRatioMin"] = filterPLRatioMin;
    }
    if (refreshCache != undefined) {
      c2sPayload["refreshCache"] = refreshCache;
    }

    return self._requestProcessor
      .process(protoId, Request, Response, c2sPayload, {
        func: "Trd_GetPositionList",
        args: args
      });
  });
}
