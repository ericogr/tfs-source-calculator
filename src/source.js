'use strict';

const Q = require('q');
const SumElements = require('./sumElements').SumElements;
const SumElementsByFileTypes = require('./sumElementsByFileTypes').SumElementsByFileTypes;
const TfsConnectionConfiguration = require('./tfsConnectionConfiguration');
const Element = require('./element');
const Branch = require('./branch');

class Source {
  constructor(options) {
    this._TfvcApi = new TfsConnectionConfiguration(options)
      .getConnection()
      .getTfvcApi();
  }

  _createSourceRequest(path = '/') {
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

  _computeBaseElements(project, path) {
    let req = this._createSourceRequest(path);

    return this._TfvcApi.getItemsBatch(req, project);
  }

  _computeElements(project, path) {
    return this
    ._computeBaseElements(project, path)
    .spread((sources) => {
      let arrElements = [];

      sources.forEach((source) => {
        let element = new Element(source.path, source.isFolder, source.isBranch, source.size, source.changeDate);

        arrElements.push(element);
      });

      return arrElements;
    });
  }

  computeSumElements(project, path) {
    return this._computeElements(project, path)
      .then((elements) => {
        let sumElements = new SumElements(path);

        elements.forEach((element) => {
          sumElements.process(element);
        });

        return sumElements;
      });
  }

  computeSumElementsByFileTypes(project, path) {
    return this._computeElements(project, path)
      .then((elements) => {
        let sumElementsByFileTypes = new SumElementsByFileTypes(path);

        elements.forEach((element) => {
          sumElementsByFileTypes.process(element);
        });

        return sumElementsByFileTypes;
      });
  }

  computeAllElements(project, path) {
    return this._computeElements(project, path)
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
