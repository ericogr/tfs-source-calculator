"use strict";

const npath = require('path');
const fs = require('fs');
const Q = require('q');
const vsts = require('vso-node-api');
const Element = require('./element');
const SumElements = require('./sumElements').SumElements;
const SumElementsByFileTypes = require('./sumElementsByFileTypes').SumElementsByFileTypes;
const TfsConnectionConfiguration = require('./tfsConnectionConfiguration');
const appConfig = require('./configuration');
const ask = require('./askConfiguration');

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

console.log(`
    TFS Console Source Calculator
    -----------------------------
     -Change username, password and other parameters at ${appConfig.CONFIG_FILENAME}
  `);

appConfig.read()
  .then((defaultConfiguration) => {
    return ask.askConfiguration(defaultConfiguration);
  })
  .then((configuration) => {
    return appConfig.save(configuration);
  })
  .then((configuration) => {
    let connectionConfiguration = new TfsConnectionConfiguration(configuration.connection);
    let connection = connectionConfiguration.getConnection();
    let req = createRequest(configuration.path);

    console.info('processing...');
    return connection.getTfvcApi().getItemsBatch(req, configuration.project);
  })
  .spread((sources) => {
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
  .done();
