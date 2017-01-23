const vsts = require('vso-node-api');
const ConnectionType = require('./connectionType');

class ConnectionNtlm extends ConnectionType {
  constructor(options) {
    super();
    this._Username = options.username;
    this._Password = options.password;
    this._Workstation = options.workstation;
    this._Domain = options.domain;
  }

  static getType() {
    return 'ntlm';
  }

  getHandler() {
    return vsts.getNtlmHandler(this._Username, this._Password);
  }
}

module.exports = ConnectionNtlm;
