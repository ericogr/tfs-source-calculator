class Project {
  constructor(id, name, state) {
    this._Id = id;
    this._Name = name;
    this._State = state;
  }

  getId() {
    return this._Id;
  }

  getName() {
    return this._Name;
  }

  getState() {
    return this._State;
  }
}

module.exports = Project;
