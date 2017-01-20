"use strict";

let fs = require('fs');
let Q = require('q');
let vsts = require('vso-node-api');
let Element = require('./element').Element;
let SumElements = require('./sumElements').SumElements;
let SumElementsByFileTypes = require('./sumElementsByFileTypes').SumElementsByFileTypes;

const CONFIG_FILENAME = '.config.json';
const DEFAULT_TFS_URL = 'http://localhost:8080/tfs/DefaultCollection';
const DEFAULT_TFS_PROJECT = 'Xpto';
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function readConfiguration() {
  let defer = Q.defer();

  fs.readFile(CONFIG_FILENAME, {'encoding': 'utf8', 'flag': 'r'}, (err, data) => {
    if (err) {
      return defer.reject(err);
    }

    return defer.resolve(JSON.parse(data));
  });

  return defer.promise;
}

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

readConfiguration()
  .then((configuration) => {
    console.log(configuration);
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
