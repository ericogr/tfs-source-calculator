'use strict';

const Q = require('q');
const SumElements = require('./sumElements').SumElements;
const SumElementsByFileTypes = require('./sumElementsByFileTypes').SumElementsByFileTypes;
const TfsConnectionConfiguration = require('./tfsConnectionConfiguration');
const Element = require('./element');
const Branch = require('./branch');

class Source {
  constructor(options) {
    let connectionConfiguration = new TfsConnectionConfiguration(options).getConnection();

    this._TfvcApi = connectionConfiguration.getTfvcApi();
    this._CoreApi = connectionConfiguration.getCoreApi();
  }

  _computeElementsPathArray(paths) {
    if (!Array.isArray(paths)) {
      paths = [paths];
    }

    let promiseElements = [];

    paths.forEach((path) => {
      promiseElements.push(this._computeElementsPath(path));
    });

    let allElements = [];
    return Q.all(promiseElements)
      .then((elementsArr) => {
        elementsArr.forEach((elements) => {
          allElements = allElements.concat(elements);
        });

        return allElements;
      });
  }

  _computeElementsPath(path) {
    return this._TfvcApi
      .getItem(undefined, undefined, undefined, undefined, path, 'Full')
      .then((sources) => {
        let arrElements = [];

        sources.value.forEach((source) => {
          let element = new Element(source.path, source.isFolder, source.isBranch, source.size, source.changeDate);

          arrElements.push(element);
        });

        return arrElements;
      });
  }

  _computeElements(path) {
    if (path === undefined) {
      return this._getAllProjectPaths()
        .then((paths) => {
            return this._computeElementsPathArray(paths);
        });
    }

    return this._computeElementsPath(path);
  }

  _getAllProjectPaths() {
    let paths = [];

    return this._CoreApi
      .getProjects()
      .then((projects) => {
        projects.forEach((project) => {
          paths.push(`$/${project.name}`);
        });

        return paths;
      });
  }

  computeSumElements(path) {
    return this._computeElements(path)
      .then((elements) => {
        let sumElements = new SumElements(path);

        elements.forEach((element) => {
          sumElements.process(element);
        });

        return sumElements;
      });
  }

  computeSumElementsByFileTypes(path) {
    return this._computeElements(path)
      .then((elements) => {
        let sumElementsByFileTypes = new SumElementsByFileTypes(path);

        elements.forEach((element) => {
          sumElementsByFileTypes.process(element);
        });

        return sumElementsByFileTypes;
      });
  }

  computeAllElements(path) {
    return this._computeElements(path)
      .then((elements) => {
        let sumElements = new SumElements(path);
        let sumElementsByFileTypes = new SumElementsByFileTypes(path);

        elements.forEach((element) => {
          sumElements.process(element);
          sumElementsByFileTypes.process(element);
        });

        return {
          'sumElements': sumElements,
          'sumElementsByFileTypes': sumElementsByFileTypes
        };
      });
  }

}

module.exports = Source;
