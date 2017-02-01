'use strict';

const Q = require('q');
const SumElements = require('./sumElements').SumElements;
const SumElementsByFileTypes = require('./sumElementsByFileTypes').SumElementsByFileTypes;
const BaseApi = require('./baseApi');
const Element = require('./element');
const Branch = require('./branch');

class Source extends BaseApi {
  constructor(options) {
    super(options);
    this._TfvcApi = this._Connection.getTfvcApi();
  }

  getElements(path) {
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

  computeSumElements(path) {
    return this.getElements(path)
      .then((elements) => {
        let sumElements = new SumElements(path);

        elements.forEach((element) => {
          sumElements.process(element);
        });

        return sumElements;
      });
  }

  computeSumElementsByFileTypes(path) {
    return this.getElements(path)
      .then((elements) => {
        let sumElementsByFileTypes = new SumElementsByFileTypes(path);

        elements.forEach((element) => {
          sumElementsByFileTypes.process(element);
        });

        return {
          'path': path,
          'sumElementsByFileTypes': sumElementsByFileTypes
        };
      });
  }

  computeAllElements(path) {
    return this.getElements(path)
      .then((elements) => {
        let sumElements = new SumElements(path);
        let sumElementsByFileTypes = new SumElementsByFileTypes(path);

        elements.forEach((element) => {
          sumElements.process(element);
          sumElementsByFileTypes.process(element);
        });

        return {
          'path': path,
          'sumElements': sumElements,
          'sumElementsByFileTypes': sumElementsByFileTypes
        };
      });
  }

}

module.exports = Source;
