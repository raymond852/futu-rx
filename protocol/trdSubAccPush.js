const path = require("path");
const protoLoader = require('./helper/protoLoader');
const nullcheck = require('../util/nullcheck');
const rxjs = require('rxjs');
const defer = rxjs.defer;
const throwError = rxjs.throwError;

const protoPath = path.resolve(__dirname, "../pb/Trd_SubAccPush.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/trade_protocol.html#trd-subaccpush-proto-2008
module.exports = function () {
  const self = this;
  const args = Array.prototype.slice.call(arguments);
  return defer(() => {
    const protoId = "2008";

    if (nullcheck.isNull(self._protocolStateObj['accList'])) {
      return throwError("please call client.trdGetAccList first");
    }

    var account = self._protocolStateObj['accList'].map((accInfo) => {
      return accInfo['accID'];
    });

    if (account.length == 0) {
      return throwError(`cannot find any trade account with account list ${self._protocolStateObj['accList']}`);
    }

    const c2sPayload = {
      accIDList: account
    };

    console.log(c2sPayload);

    return self._requestProcessor
      .process(protoId, Request, Response, c2sPayload, {
        func: "Trd_SubAccPush",
        args: args
      });
  });
}
