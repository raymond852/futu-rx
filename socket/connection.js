const Subject = require("rxjs").Subject;

const CONNECTION_STATUS = Object.freeze({
  Idle: 'Idle',
  Connecting: 'Connecting',
  Connected: 'Connected',
  Disconnecting: 'Disconnecting',
  Disconnected: 'Disconnected'
});

function Connection(host, port) {
  this._host = host;
  this._port = port;

  this._connectionStatus = CONNECTION_STATUS.Idle;
  this._connectionStatusSubject = new Subject();
  this._dataRecvSubject = new Subject();
  this._dataSentSubject = new Subject();
  this._connectionErrorSubject = new Subject();
}

Connection.CONNECTION_STATUS = CONNECTION_STATUS;

Connection.prototype.getHost = function () {
  return this._host;
};

Connection.prototype.getConnectionStatus = function () {
  return this._connectionStatus;
};

Connection.prototype.getPort = function () {
  return this._port;
};

Connection.prototype.connectionStatus = function () {
  return this._connectionStatusSubject;
};

Connection.prototype.dataRecv = function () {
  return this._dataRecvSubject;
};

Connection.prototype.dataSent = function () {
  return this._dataSentSubject;
};

Connection.prototype.connectionError = function () {
  return this._connectionErrorSubject;
};

module.exports = Connection;
