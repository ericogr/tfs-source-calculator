const SumElements = require('./sumElements').SumElements;
const SumElementsByFileTypes = require('./sumElementsByFileTypes').SumElementsByFileTypes;
const TfsConnectionConfiguration = require('./tfsConnectionConfiguration');
const Element = require('./element');

class Source {
  constructor(options) {
    this._Connection = new TfsConnectionConfiguration(options).getConnection();
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

  _computeBase(project, path) {
    let req = this._createSourceRequest(path);

    return this._Connection
      .getTfvcApi()
      .getItemsBatch(req, project);
  }

  computeSumElements(project, path) {
    return this
      ._computeBase(project, path)
      .spread((sources) => {
        let sumElements = new SumElements();

        sources.forEach((source) => {
          let element = new Element(source.path, source.isFolder, source.isBranch, source.size, source.changeDate);
          sumElements.process(element);
        });

        return sumElements;
      });
  }

  computeSumElementsByFileTypes(project, path) {
    return this
      ._computeBase(project, path)
      .spread((sources) => {
        let sumElementsByFileTypes = new SumElementsByFileTypes();

        sources.forEach((source) => {
          let element = new Element(source.path, source.isFolder, source.isBranch, source.size, source.changeDate);
          sumElementsByFileTypes.process(element);
        });

        return sumElementsByFileTypes;
      });
  }

  computeElements(project, path) {
    let req = this._createSourceRequest(path);

    return this
      ._computeBase(project, path)
      .spread((sources) => {
        let sumElements = new SumElements();
        let sumElementsByFileTypes = new SumElementsByFileTypes();

        sources.forEach((source) => {
          let element = new Element(source.path, source.isFolder, source.isBranch, source.size, source.changeDate);
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
