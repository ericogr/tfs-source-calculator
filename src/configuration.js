
const npath = require('path');
const fs = require('fs');
const Q = require('q');

const CONFIG_FILENAME = '/home/erico/.tfs-source-calculator/config.json';
const DEFAULT_CONFIG = {
  'url': 'http://localhost:8080/tfs/DefaultCollection',
  'project': 'xpto',
  'path': '/',
  'username': '',
  'password': ''
};

module.exports.read = function() {
  let defer = Q.defer();

  fs.readFile(CONFIG_FILENAME, {'encoding': 'utf8', 'flag': 'r'}, (err, data) => {
    if (err) {
      return defer.resolve(DEFAULT_CONFIG);
    }

    return defer.resolve(JSON.parse(data));
  });

  return defer.promise;
}

module.exports.save = function(configuration) {
  return makeConfigDirectory(CONFIG_FILENAME)
    .then(() => {
      return saveConfiguration(configuration);
    });
}

function makeConfigDirectory(configPath) {
  let defer = Q.defer();
  let dirname = npath.dirname(configPath);

  fs.mkdir(dirname, () => {
    return defer.resolve();
  });

  return defer.promise;
}

function saveConfiguration(configuration) {
  let defer = Q.defer();
  let data = JSON.stringify(configuration);

  fs.writeFile(CONFIG_FILENAME, data, (err) => {
    if (err) {
      return defer.reject(err);
    }

    return defer.resolve(configuration);
  });

  return defer.promise;
}
