"use strict";

let Q = require("q");
let vsts = require('vso-node-api');
let Element = require('./element').Element;
let SumElements = require('./sumElements').SumElements;
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const DEFAULT_TFS_URL = 'http://localhost:8080/tfs/DefaultCollection';
const DEFAULT_TFS_PROJECT = 'Xpto';

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

function askUsername() {
  return ask('Username: ');
}

function askPassword() {
  return ask('Password: ');
}

function askTfsUrl() {
  return ask(`TFS URL [${DEFAULT_TFS_URL}]: `, DEFAULT_TFS_URL);
}

function askProject() {
  return ask(`Project [${DEFAULT_TFS_PROJECT}]: `, DEFAULT_TFS_PROJECT);
}

function askPath() {
  return ask(`Path [\\]: `, '\\');
}

askUsername()
  .then((username) => {
    return [username, askPassword()];
  })
  .spread((username, password) => {
    return [username, password, askTfsUrl()];
  })
  .spread((username, password, collectionUrl) => {
    return [username, password, collectionUrl, askProject()];
  })
  .spread((username, password, collectionUrl, project) => {
    return [username, password, collectionUrl, project, askPath()];
  })
  .spread((username, password, collectionUrl, project, path) => {
    let handler = vsts.getNtlmHandler(username, password);
    let connection = new vsts.WebApi(collectionUrl, handler);
    let req = createRequest(path);
    return connection.getTfvcApi().getItemsBatch(req, project);
  })
  .spread((sources) => {
    let sumElements = new SumElements();

    console.info('processing...');

    sources.forEach((source) => {
      let element = new Element(source.path, !source.isFolder, source.size, source.changeDate);
      sumElements.process(element);
    });

    return sumElements;
  })
  .then((ret) => {
    console.info("----------------------------");
    console.info(ret);
    console.info("----------------------------");
  })
  .catch((err) => {
    console.info("erro:");
    console.info(err);
  })
  .done(() => {
    rl.close();
  });
