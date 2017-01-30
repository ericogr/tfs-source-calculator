class SumElements {
  constructor(path) {
    this._Path = path;
    this._Branches = 0;
    this._Files = 0;
    this._Folders = 0;
    this._Size = 0;
  }

  process(element) {
    if (element.isFile()) {
      this._Files++;
      this._Size += element.getSize();
    }

    if (element.isFolder()) {
      this._Folders++;
    }

    if (element.isBranch()) {
      this._Branches++;
    }
  }

  getPath() {
    return this._Path;
  }

  getFiles() {
    return this._Files;
  }

  getFolders() {
    return this._Folders;
  }

  getBranches() {
    return this._Branches;
  }

  getSize() {
    return this._Size;
  }

  toString() {
    return `Files: ${this._Files}, Folders: ${this._Folders}, Branches: ${this._Branches}, Size: ${this._Size}`;
  }
}

module.exports.SumElements = SumElements;
