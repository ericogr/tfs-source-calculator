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

function askTfsUrl(defaultValue) {
  return ask(`TFS URL [${defaultValue}]: `, defaultValue);
}

function askProject(defaultValue) {
  return ask(`Project [${defaultValue}]: `, defaultValue);
}

function askPath(defaultValue) {
  return ask(`Path [${defaultValue}]: `, defaultValue);
}

module.exports.askConfiguration = function(configuration) {
  return askTfsUrl(configuration.connection.url)
    .then((url) => {
      configuration.connection.url = url;

      return configuration;
    })
    .then((configuration) => {
      return askProject(configuration.project)
        .then((project) => {
          configuration.project = project;

          return configuration;
        });
    })
    .then((configuration) => {
      return askPath(configuration.path)
        .then((path) => {
          configuration.path = path;

          rl.close();

          return configuration;
        });
    });
}
