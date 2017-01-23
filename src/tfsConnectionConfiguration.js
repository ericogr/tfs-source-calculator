const Q = require('q');
const vsts = require('vso-node-api');
const ConnectionBasic = require('./connectionBasic');
const ConnectionNtlm = require('./connectionNtlm');
const ConnectionBearer = require('./connectionBearer');

class TfsConnectionConfiguration {
  constructor(options) {
    const classes = {ConnectionBasic, ConnectionNtlm, ConnectionBearer};
    const connectionType = classes['Connection' + options.authenticationType];

    this._Type = new connectionType(options);
    this._Url = options.url;
  }

  getConnection() {
    return new vsts.WebApi(this._Url, this._Type.getHandler());
  }
}

module.exports = TfsConnectionConfiguration;
