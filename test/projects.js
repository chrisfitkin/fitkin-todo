
/* eslint-env mocha */
require("babel-polyfill");

const chai = require('chai');
const chaiHttp = require('chai-http');
const { before, after } = require('mocha');
const app = require('../src').default;
const Project = require('../src/models/Project');
const expect = chai.expect;

chai.use(chaiHttp)

const randomString = (length = 12) => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);

const route = '/api/projects'
let newProject = {
  name: `Test project ${randomString()}`
};

describe('Add/Remove/Update/Delete a project. The project will have a unique name and will be used to group a list of tasks.', () => {
  
  before(`POST ${route} should create a new project`, (done) => {
    chai.request(app.server)
      .post(route)
      .set('Authentication', 'Basic YWxhZGRpbkBnbWFpbC5jb206T3BlblNlc2FtZQ==')
      .send(newProject)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res).to.be.json
        expect(JSON.parse(res.text)).to.be.an('object');
        expect(JSON.parse(res.text).name).to.equal(newProject.name);
        newProject = JSON.parse(res.text);
        done();
      });
  });

  /** List projects */
  it('GET ${route} should list all projects', (done) => {
    chai.request(app.server)
      .get(route)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json
        expect(JSON.parse(res.text)).to.be.an('array');
        done();
      });
  });

  /** Update the test project */
  it('PUT ${route}/:projectId should update a project', (done) => {
    const newName = `Updated name ${randomString()}`
    chai.request(app.server)
      .put(`${route}/${newProject._id}`)
      .send({ ...newProject, name: newName })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json
        expect(JSON.parse(res.text)).to.be.an('object');
        expect(JSON.parse(res.text).name).to.equal(newName);
        newProject = JSON.parse(res.text);
        done();
      });
  });


  /** Delete the test project */
  after(() => {
    const newName = `Updated name ${randomString()}`
    chai.request(app.server)
      .delete(`${route}/${newProject._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        expect(res.text).to.equal('');
        done();
      });
  });

});