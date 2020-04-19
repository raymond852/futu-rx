const path = require("path");
const protoLoader = require('./helper/protoLoader');
const nullcheck = require('../util/nullcheck');
const rxjs = require('rxjs');
const defer = rxjs.defer;
const throwError = rxjs.throwError;

const protoPath = path.resolve(__dirname, "../pb/Trd_PlaceOrder.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/trade_protocol.html#trd-modifyorder-proto-2205
module.exports = function (enumTrdEnv, enumTrdMarket, enumTrdSide, orderId, enumTrdModifyOrderOp, forAll, qty, price, adjustPrice, adjustSideAndLimit) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);
  return defer(() => {
    const protoId = "2205";

    if (nullcheck.isNull(self._protocolStateObj['accList'])) {
      return throwError("please call client.trdGetAccList first");
    }

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
      packetID: {
        connID: self._protocolStateObj['connID'],
        serialNo: self.currentRequestId()
      },
      header: {
        trdEnv: enumTrdEnv,
        accID: accounts[0]['accID'],
        trdMarket: enumTrdMarket
      },
      trdSide: enumTrdSide,
      orderId: orderId,
      modifyOrderOp: enumTrdModifyOrderOp
    };

    if (forAll != undefined) {
      c2sPayload.forAll = forAll;
    }
    if (qty != undefined) {
      c2sPayload.qty = forAll;
    }
    if (price != undefined) {
      c2sPayload.price = price;
    }
    if (adjustPrice != undefined) {
      c2sPayload.adjustPrice = adjustPrice;
    }
    if (adjustSideAndLimit != undefined) {
      c2sPayload.adjustSideAndLimit = adjustSideAndLimit;
    }

    return self._requestProcessor
      .process(protoId, Request, Response, c2sPayload, {
        func: "Trd_ModifyOrder",
        args: args
      });
  });
}
