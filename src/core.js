'use strict';

const Q = require('q');
const BaseApi = require('./baseApi');
const Project = require('./project');

class Core extends BaseApi {
  constructor(options) {
    super(options);
    this._CoreApi = this._Connection.getCoreApi();
  }

  getProjects() {
    let projects = [];

    return this._CoreApi
      .getProjects()
      .then((rawProjects) => {
        rawProjects.forEach((rawProject) => {
          let project = new Project(rawProjects.id, rawProject.name, rawProject.state);
          projects.push(project);
        });

        return projects;
      });
  }
}

module.exports = Core;
