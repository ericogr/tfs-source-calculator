class Branch {
  constructor(path, childrens) {
    this._Path = path;
    this._Childrens = childrens;
  }

  getPath() {
    return this._Path;
  }

  getChildrens() {
    return this._Childrens;
  }

  hasChildren() {
    return this._Childrens !== undefined && this._Childrens.length > 0;
  }
}

module.exports = Branch;
