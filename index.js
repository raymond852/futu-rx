const Client = require('./socket/client');
const Subject = require('rxjs').Subject;
const util = require('util');


/**
 * Futu Opend Protocol Client
 *
 * @author raymonddu
 * @param {JSON} clientConfig
 */
function Futu(clientConfig) {
  Client.call(this, clientConfig);
  this._clientConfig = clientConfig;
  this._protocolStateSubject = new Subject();
  this._protocolStateObj = {};

  require('./protocol/keepAlive').call(this);
}

util.inherits(Futu, Client);

Futu.prototype.initConnect = require('./protocol/initConnect');
Futu.prototype.qotGetBasicQot = require('./protocol/qotGetBasicQot');
Futu.prototype.qotGetKL = require('./protocol/qotGetKL');
Futu.prototype.qotGetRT = require('./protocol/qotGetRT');
Futu.prototype.qotSub = require('./protocol/qotSub');
Futu.prototype.trdGetAccList = require('./protocol/trdGetAccList');
Futu.prototype.trdGetFunds = require('./protocol/trdGetFunds');
Futu.prototype.trdGetHistoryOrderList = require('./protocol/trdGetHistoryOrderList');
Futu.prototype.trdUnlockTrade = require('./protocol/trdUnlockTrade');
Futu.prototype.trdPlaceOrder = require('./protocol/trdPlaceOrder')

Futu.Enum = {
  ...require('./protocol/enum/qotEnum'),
  ...require('./protocol/enum/trdEnum')
}

module.exports = Futu;
