const TfsConnectionConfiguration = require('./tfsConnectionConfiguration');

class BaseApi {
  constructor(options) {
    this._Connection = new TfsConnectionConfiguration(options).getConnection();
  }
}

module.exports = BaseApi;
