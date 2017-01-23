"use strict";

const Q = require('q');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultValue = '') {
  let defer = Q.defer();

  rl.question(question, (answer) => {
    answer = answer || defaultValue;

    return defer.resolve(answer);
  });

  return defer.promise;
}

function askUsername(defaultValue) {
  return ask(`Username [${defaultValue}]: `, defaultValue);
}

function askPassword(defaultValue) {
  return ask(`Password [${defaultValue}]: `, defaultValue);
}

function askTfsUrl(defaultValue) {
  return ask(`TFS URL [${defaultValue}]: `, defaultValue);
}

function askProject(defaultValue) {
  return ask(`Project [${defaultValue}]: `, defaultValue);
}

function askPath(defaultValue) {
  return ask(`Path [${defaultValue}]: `, defaultValue);
}

module.exports.askConfiguration = function(defaultConfiguration) {
  return askUsername(defaultConfiguration.username)
    .then((username) => {
      let configuration = {};

      configuration.username = username;

      return configuration;
    })
    .then((configuration) => {
      return askPassword(defaultConfiguration.password)
        .then((password) => {
          configuration.password = password;

          return configuration;
        });
    })
    .then((configuration) => {
      return askTfsUrl(defaultConfiguration.url)
        .then((url) => {
          configuration.url = url;

          return configuration;
        });
    })
    .then((configuration) => {
      return askProject(defaultConfiguration.project)
        .then((project) => {
          configuration.project = project;

          return configuration;
        });
    })
    .then((configuration) => {
      return askPath(defaultConfiguration.path)
        .then((path) => {
          configuration.path = path;

          rl.close();
          
          return configuration;
        });
    });
}
