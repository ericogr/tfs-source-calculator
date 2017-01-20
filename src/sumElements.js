class SumElements {
  constructor() {
    this._Files = 0;
    this._Folders = 0;
    this._Size = 0;
  }

  process(element) {
    if (element.isFile()) {
      this._Files +=  1;
      this._Size += element.getSize() || 0;
    }
    else {
      this._Folders += 1;
    }
  }

  getFiles() {
    return this._Files;
  }

  getFolders() {
    return this._Folders;
  }

  getSize() {
    return this._Size;
  }

  toString() {
    return `Files: ${this._Files}, Folders: ${this._Folders}, Size: ${this._Size}`;
  }
}

module.exports.SumElements = SumElements;
