
const npath = require('path');
const fs = require('fs');
const Q = require('q');

const CONFIG_FILENAME = '/home/erico/.tfs-source-calculator/config.json';
const DEFAULT_CONFIG = {
  'connection': {
    'authenticationType': 'Ntlm',
    'url': 'http://localhost:8080/tfs/DefaultCollection',
    'username': '',
    'password': ''
  },
  'project': 'xpto',
  'path': '$/'
};

function read() {
  let defer = Q.defer();

  fs.readFile(CONFIG_FILENAME, {'encoding': 'utf8', 'flag': 'r'}, (err, data) => {
    if (err) {
      return defer.resolve(DEFAULT_CONFIG);
    }

    return defer.resolve(JSON.parse(data));
  });

  return defer.promise;
}

function save(configuration) {
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

module.exports.CONFIG_FILENAME = CONFIG_FILENAME;
module.exports.save = save;
module.exports.read = read;
