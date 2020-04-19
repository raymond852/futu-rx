const path = require("path");
const protoLoader = require('./helper/protoLoader');
const nullcheck = require('../util/nullcheck');
const rxjs = require('rxjs');
const defer = rxjs.defer;
const throwError = rxjs.throwError;

const protoPath = path.resolve(__dirname, "../pb/Trd_UnlockTrade.proto");
const [Request, Response] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/trade_protocol.html#trd-unlocktrade-proto-2005
module.exports = function (unlock) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);
  return defer(() => {
    const protoId = "2005";

    const clientConfig = self._clientConfig;

    if (nullcheck.isNull(clientConfig.pwdMD5)) {
      throwError("client config pwdMD5 cannot be null");
    }

    const c2sPayload = {
      pwdMD5: clientConfig.pwdMD5,
      unlock: unlock
    };

    return self._requestProcessor
      .process(protoId, Request, Response, c2sPayload, {
        func: "Trd_UnlockTrade",
        args: args
      });
  });
}
