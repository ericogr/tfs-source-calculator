"use strict";

class Element {
  constructor(path, isFolder, isBranch, size, date) {
    this._Path = path;
    this._IsFolder = isFolder;
    this._IsBranch = isBranch;
    this._Size = size;
    this._Date = date;
  }

  getPath() {
    return this._Path;
  }

  isFile() {
    return !this._IsFolder;
  }

  isFolder() {
    return this._IsFolder;
  }

  isBranch() {
    return this._IsBranch;
  }

  getSize() {
    return this._Size || 0;
  }

  getDate() {
    return this._Date;
  }

  toString() {
    return `path: ${this._Path}, isFolder: ${this._IsFolder}, isBranch: ${this._IsBranch} size: ${this._Size}, date: ${this._Date}`;
  }
}

module.exports = Element;
