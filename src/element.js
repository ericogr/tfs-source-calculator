"use strict";

class Element {
  constructor(path, isFile, size, date) {
    this._Path = path;
    this._IsFile = isFile;
    this._Size = size;
    this._Date = date;
  }

  getPath() {
    return this._Path;
  }

  isFile() {
    return this._IsFile;
  }

  getSize() {
    return this._Size;
  }

  getDate() {
    return this._Date;
  }

  toString() {
    return `path: ${this._Path}, isFile: ${this._IsFile}, size: ${this._Size}, date: ${this._Date}`;
  }
}

module.exports.Element = Element;
