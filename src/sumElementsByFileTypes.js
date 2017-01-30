class SumElementsByFileTypes {
  constructor(path) {
    this.Path = path;
    this._FileMap = new Map();
  }

  process(element) {
    if (element.isFile()) {
      let type = SumElementsByFileTypes.getFileType(element.getPath());
      let sumByFileType = this._FileMap.get(type);

      if (!sumByFileType) {
        sumByFileType = new SumByFileType(type);
        this._FileMap.set(type, sumByFileType);
      }

      sumByFileType.increment();
      sumByFileType.addSize(element.getSize());
    }
  }

  static getFileType(filename) {
    let tokens = filename.split('.');

    if (tokens.length > 1) {
      let extension = tokens.pop();

      if (extension.indexOf('/') === -1) {
        return extension.toLowerCase();
      }
    }

    return '';
  }

  getPath() {
    return this._Path;
  }

  toString() {
    let output = "";

    for (var [key, value] of this._FileMap) {
      output += `type: ${key}, count: ${value.count()} size: ${value.getSize()}\n`;
    }

    return output;
  }
}

class SumByFileType {
  constructor(type) {
    this._Type = type;
    this._Count = 0;
    this._Size = 0;
  }

  getType() {
    return this._Type;
  }

  increment() {
    this._Count++;
  }

  addSize(size) {
    this._Size += size;
  }

  count() {
    return this._Count;
  }

  getSize() {
    return this._Size;
  }
}

module.exports.SumElementsByFileTypes = SumElementsByFileTypes;
