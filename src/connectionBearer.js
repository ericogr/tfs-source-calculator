const vsts = require('vso-node-api');
const ConnectionType = require('./connectionType');

class ConnectionBearer extends ConnectionType {
  constructor(options) {
    super();
    this._Token = options.token;
  }

  static getType() {
    return 'bearer';
  }

  getHandler() {
    return vsts.getBearerHandler(this._Token);
  }
}

module.exports = ConnectionBearer;
