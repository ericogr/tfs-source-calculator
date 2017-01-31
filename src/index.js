"use strict";

const zlib = require('zlib');
const TfsConnectionConfiguration = require('./tfsConnectionConfiguration');
const Source = require('./source');
const appConfig = require('./configuration');
const ask = require('./askConfiguration');

console.log(`
    TFS Source Calculator (Console)
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
    let source = new Source(configuration.connection);

    console.info('processing...');
    return source.computeAllElements(configuration.project, configuration.path);
  })
  // .then((computedElements) => {
  //   console.info("----------------------------");
  //   console.info(computedElements.toString());
  //   console.info("----------------------------");
  // })
  .then((computedElements) => {
    console.info("----------------------------");
    console.info(computedElements.sumElements.toString());
    console.info(computedElements.sumElementsByFileTypes.toString());
    console.info("----------------------------");
  })
  .catch((err) => {
    console.info("erro:");
    console.info(err);
  })
  .done();
