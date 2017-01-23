const vsts = require('vso-node-api');
const ConnectionType = require('./connectionType');

class ConnectionBasic extends ConnectionType {
  constructor(options) {
    super();
    this._Username = options.username;
    this._Password = options.password;
  }

  static getType() {
    return 'basic';
  }

  getHandler() {
    return vsts.getBasicHandler(this._Token);
  }

}

module.exports = ConnectionBasic;
