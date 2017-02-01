"use strict";

const Q = require('q');
const zlib = require('zlib');
const TfsConnectionConfiguration = require('./tfsConnectionConfiguration');
const Source = require('./source');
const Core = require('./core');
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
    this._Configuration = configuration;

    if (configuration.path !== '!') {
      return [configuration.path];
    }

    let core = new Core(this._Configuration.connection);

    return core.getProjects()
      .then((projects) => {
        let paths = [];

        projects.forEach((project) => {
          paths.push(`$/${project.getName()}`);
        });

        return paths;
      });
  })
  .then((paths) => {
    let source = new Source(this._Configuration.connection);
    let computedPromises = [];

    paths.forEach((path) => {
      computedPromises.push(source.computeAllElements(path));
    });

    return Q.all(computedPromises);
  })
  .then((computedElements) => {
    computedElements.forEach((computedElement) => {
      console.info("----------------------------");
      console.info('path: ' + computedElement.path);
      console.info(computedElement.sumElements.toString());
      console.info(computedElement.sumElementsByFileTypes.toString());
      console.info("----------------------------");
    });
  })
  .catch((err) => {
    console.info("erro:");
    console.info(err);
  })
  .done();
