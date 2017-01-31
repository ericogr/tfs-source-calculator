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

  get(filetype) {
    return this._FileMap.get(filetype);
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

  _sort() {
    return new Map([...this._FileMap.entries()].sort((a, b) => {
      if (a[1].getSize() > b[1].getSize()) {
        return -1;
      }
      if (a[1].getSize() < b[1].getSize()) {
        return 1;
      }

      return 0;
    }));
  }

  toString() {
    let output = "";

    let mapAsc = this._sort();

    for (let [key, value] of mapAsc) {
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
