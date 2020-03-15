const path = require("path");
const rxjs = require('rxjs');
const throwError = rxjs.throwError;
const defer = rxjs.defer;
const protoLoader = require('./helper/protoLoader');

const protoPath = path.resolve(__dirname, "../pb/Qot_GetSecuritySnapshot.proto");
const [
  Request,
  Response
] = protoLoader.load(protoPath);

// https://futunnopen.github.io/futu-api-doc/protocol/quote_protocol.html#qot-getsecuritysnapshot-proto-3203
module.exports = function (securityList) {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  return defer(() => {
    try {
      const protoId = "3203";
      const c2sPayload = {
        securityList: securityList,
      };

      return self._requestProcessor
        .process(protoId, Request, Response, c2sPayload, {
          func: 'Qot_GetSecuritySnapshot',
          args: args
        });
    } catch (e) {
      return throwError(e);
    }
  });
}
