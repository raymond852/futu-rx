const path = require("path");
const protoLoader = require('./helper/protoLoader');
const requestProcessor = require('./helper/requestProcessor');
const nullcheck = require('../util/nullcheck');
const tap = require('rxjs/operators').tap;
const rxjs = require('rxjs');
const defer = rxjs.defer;
const throwError = rxjs.throwError;

const protoPath = path.resolve(__dirname, "../pb/Trd_GetAccList.proto");
const [Request, Response] = protoLoader.load(protoPath);

module.exports = function () {
  const self = this;
  const args = Array.prototype.slice.call(arguments);
  return defer(() => {
    const protoId = "2001";

    const clientConfig = self._clientConfig;

    if (nullcheck.isNull(clientConfig.accountId)) {
      return throwError("client config accountId cannot be null");
    }

    const c2sPayload = {
      userID: clientConfig.accountId,
    };

    return requestProcessor
      .process(self, protoId, Request, Response, c2sPayload, {
        func: "trdGetAccList",
        args: args
      })
      .pipe(
        tap((context) => {
          const response = context.response;
          self._protocolStateObj['accList'] = response['s2c']['accList'];
          self._protocolStateSubject.next(new Set(['accList']));
        })
      );
  });
}
