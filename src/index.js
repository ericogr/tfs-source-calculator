"use strict";

const npath = require('path');
const fs = require('fs');
const Q = require('q');
const vsts = require('vso-node-api');
const Element = require('./element').Element;
const SumElements = require('./sumElements').SumElements;
const SumElementsByFileTypes = require('./sumElementsByFileTypes').SumElementsByFileTypes;
const appConfig = require('./configuration');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function createRequest(path = '/') {
  return {
      includeContentMetadata: true,
      includeLinks: true,
      itemDescriptors: [
          {
              path: path,
              recursionLevel: 'Full'
          }
      ]
  };
}

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

appConfig.read()
  .then((configuration) => {
    return askUsername(configuration.username)
      .then((username) => {
        configuration.username = username;

        return configuration;
      });
  })
  .then((configuration) => {
    return askPassword(configuration.password)
      .then((password) => {
        configuration.password = password;

        return configuration;
      });
  })
  .then((configuration) => {
    return askTfsUrl(configuration.url)
      .then((url) => {
        configuration.url = url;

        return configuration;
      });
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

        return configuration;
      });
  })
  .then((configuration) => {
    return appConfig.save(configuration);
  })
  .then((configuration) => {
    let handler = vsts.getNtlmHandler(configuration.username, configuration.password);

    console.info('connecting...');
    let connection = new vsts.WebApi(configuration.url, handler);
    let req = createRequest(configuration.path);

    console.info('getting data...');
    return connection.getTfvcApi().getItemsBatch(req, configuration.project);
  })
  .spread((sources) => {
    console.info('processing...');

    let sumElements = new SumElements();
    let sumElementsByFileTypes = new SumElementsByFileTypes();

    sources.forEach((source) => {
      let element = new Element(source.path, !source.isFolder, source.size, source.changeDate);
      sumElements.process(element);
      sumElementsByFileTypes.process(element);
    });

    return [sumElements, sumElementsByFileTypes];
  })
  .spread((sumElements, sumElementsByFileTypes) => {
    console.info("----------------------------");
    console.info(sumElements.toString());
    console.info(sumElementsByFileTypes.toString());
    console.info("----------------------------");
  })
  .catch((err) => {
    console.info("erro:");
    console.info(err);
  })
  .done(() => {
    rl.close();
  });
