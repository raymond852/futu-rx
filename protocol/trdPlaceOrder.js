const path = require("path");
const protoLoader = require('./helper/protoLoader');
const nullcheck = require('../util/nullcheck');
const rxjs = require('rxjs');
const defer = rxjs.defer;
const throwError = rxjs.throwError;

const protoPath = path.resolve(__dirname, "../pb/Trd_PlaceOrder.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/trade_protocol.html#trd-placeorder-proto-2202
module.exports = function (enumTrdEnv, enumTrdMarket, enumTrdSide, enumTrdOrderType, secCode, qty, price) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);
  return defer(() => {
    const protoId = "2202";

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
      code: secCode,
      orderType: enumTrdOrderType,
      qty: qty,
      price: price
    };

    return self._requestProcessor
      .process(protoId, Request, Response, c2sPayload, {
        func: "Trd_PlaceOrder",
        args: args
      });
  });
}
