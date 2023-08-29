const { expect } = require("chai");
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
const { validationResult } = require("express-validator");
const Candidate = require("../models/candidate");
const User = require("../models/user");
const { reportModel } = require("../models/report");
const { CourtSearch } = require("../models/court-search");

const {
  getCandidate,
  getCandidatesByUser,
  createCandidate,
  deleteCandidate,
  getReportByCandId,
  updateReportByCandId,
} = require("../controllers/candidate");
const { AdverseAction } = require("../models/adverse-action");

describe("candidate Controller", () => {
  it("getCandidate - with candidate not found error", async function () {
    sandbox.stub(validationResult, "withDefaults").returns({
      isEmpty: sandbox.stub().returns(true),
    });
    const req = {
      params: {
        candidateId: "1",
      },
      userId: "64e52362e9dbf9c055ab5cba",
    };
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    sandbox.stub(Candidate, "findById").returns(null);
    const next = sinon.spy();
    await getCandidate(req, res, next);
    expect(next.called).to.be.true;
    expect(next.args[0][0].statusCode).to.equal(404);
    expect(next.args[0][0].message).to.equal("Fetching Candidates Failed.");
    expect(JSON.stringify(next.args[0][0].data)).to.equal(
      JSON.stringify(["Could not find candidate."])
    );
  });
  it("getCandidate - with success status", async function () {
    const req = {
      params: {
        candidateId: "1",
      },
      userId: "64e52362e9dbf9c055ab5cba",
    };
    const candidate = new Candidate({
      _id: "1",
      name: "@divya",
      email: "adfa@gmail.com",
      phone: 1234567890,
      dob: "1990-01-09T00:00:00.000Z",
      location: "Some City",
      zipCode: 12345,
      socialSecurity: 123456789,
      driverLicense: 1234567890678678,
      user: "64e52362e9dbf9c055ab5cba",
    });
    sandbox.stub(Candidate, "findById").returns(candidate);
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    await getCandidate(req, res, () => {});
    expect(res.status.args[0][0]).to.equal(200);
    expect(JSON.stringify(res.json.args[0][0].message)).to.equal(
      JSON.stringify("candidate fetched.")
    );
    expect(res.json.args[0][0].data).to.be.equal(candidate);
  });
  it("createCandidate - with success status", async function () {
    sandbox.stub(validationResult, "withDefaults").returns({
      isEmpty: sandbox.stub().returns(true),
    });
    const candidate = new Candidate({
        _id: "1",
        name: "@divya",
        email: "adfa@gmail.com",
        phone: 1234567890,
        dob: "1990-01-09T00:00:00.000Z",
        location: "Some City",
        zipCode: 12345,
        socialSecurity: 123456789,
        driverLicense: 1234567890678678,
        user: "64e52362e9dbf9c055ab5cba",
    });
    const user = new User({
      _id: "1",
      email: "test@gmail.com",
      candidates: [],
    });
    const newUser = new User({
      _id: "1",
      email: "test@gmail.com",
      candidates: [{ _id: "1", user: "64e52362e9dbf9c055ab5cba" }],
    });
    sandbox.stub(Candidate.prototype, "save").returns(candidate);
    sandbox.stub(User, "findById").returns(user);
    sandbox.stub(User.prototype, "save").returns(newUser);
    const req = {
      body: {
        _id: "1",
        name: "@divya",
        email: "adfa@gmail.com",
        phone: 1234567890,
        dob: "1990-01-09T00:00:00.000Z",
        location: "Some City",
        zipCode: 12345,
        socialSecurity: 123456789,
        driverLicense: 1234567890678678,
      },
      userId: "1",
    };
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    await createCandidate(req, res, () => {});
    expect(res.status.args[0][0]).to.equal(201);
    expect(JSON.stringify(res.json.args[0][0])).to.equal(
      JSON.stringify({ message: "Candidate created successfully" })
    );
  });
  it("deleteCandidate", async function () {
    sandbox.stub(validationResult, "withDefaults").returns({
      isEmpty: sandbox.stub().returns(true),
    });
    const candidateMockData = new Candidate({
      _id: "1",
      name: "@divya",
      email: "adfa@gmail.com",
      phone: 1234567890,
      dob: "1990-01-09T00:00:00.000Z",
      location: "Some City",
      zipCode: 12345,
      socialSecurity: 123456789,
      driverLicense: 1234567890678678,
      user: "64e52362e9dbf9c055ab5cba",
    });
    const userMockData = new User({
      _id: "1",
      email: "test@gmail.com",
      candidates: [candidateMockData],
    });
    const newUserMockData = new User({
      _id: "1",
      email: "test@gmail.com",
      candidates: [candidateMockData],
    });
    sandbox.stub(Candidate, "findByIdAndDelete").returns(candidateMockData);
    sandbox.stub(CourtSearch, "deleteMany");
    sandbox.stub(AdverseAction, "deleteMany");
    sandbox.stub(User, "findById").returns(userMockData);
    sandbox.stub(User.prototype, "save").returns(newUserMockData);
    const req = {
      params: {
        candidateId: "1",
      },
      userId: "64e52362e9dbf9c055ab5cba",
    };
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    await deleteCandidate(req, res, () => {});
    expect(res.status.args[0][0]).to.equal(200);
    expect(JSON.stringify(res.json.args[0][0])).to.equal(
      JSON.stringify({ message: "candidate deleted." })
    );
  });
  it("getCandidatesByUser ", async function () {
    const req = {
      query: {
        perPage: "2",
        page: "1",
      },
      userId: "64e52362e9dbf9c055ab5cba",
    };
    const candidate = new Candidate({
      _id: "1",
      name: "@divya",
      email: "adfa@gmail.com",
      phone: 1234567890,
      dob: "1990-01-09T00:00:00.000Z",
      location: "Some City",
      zipCode: 12345,
      socialSecurity: 123456789,
      driverLicense: 1234567890678678,
      user: "64e52362e9dbf9c055ab5cba",
    });
    sandbox.stub(Candidate, "find").returns({
      countDocuments: sinon.stub().resolves(1),
      skip: sinon.stub().returnsThis(),
      limit: sinon
        .stub()
        .resolves([{ _id: "candidate1Id", name: "Candidate 1" }]),
    });
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    await getCandidatesByUser(req, res, () => {});
    expect(res.status.args[0][0]).to.equal(200);
    expect(JSON.stringify(res.json.args[0][0].message)).to.equal(
      JSON.stringify("Fetched candidates successfully.")
    );
    expect(res.json.args[0][0].totalItems).to.be.equal(1);
  });
  it("getReportByCandId", async function () {
    sandbox.stub(validationResult, "withDefaults").returns({
      isEmpty: sandbox.stub().returns(true),
    });
    const req = {
      params: {
        candidateId: "1",
      },
      userId: "64e52362e9dbf9c055ab5cba",
    };
    const report = new reportModel({
      status: "CLEAR",
      adjudication: "",
      package: "Employee Pro",
      turnAroundTime: "NA",
      _id: "1",
    });
    const candidate = new Candidate({
      _id: "1",
      name: "divya",
      email: "cand@gmail.com",
      phone: 1234567890,
      dob: "1990-01-09T00:00:00.000Z",
      location: "Some City",
      zipCode: 12345,
      socialSecurity: 123456789,
      driverLicense: 1234567890678678,
      reports: report,
      user: "64e52362e9dbf9c055ab5cba",
    });

    sandbox.stub(Candidate, "findById").returns(candidate);
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    await getReportByCandId(req, res, () => {});
    expect(res.status.args[0][0]).to.equal(200);
    expect(JSON.stringify(res.json.args[0][0].message)).to.equal(
      JSON.stringify("report fetched.")
    );
    expect(JSON.stringify(res.json.args[0][0].data)).to.be.equal(
      JSON.stringify(report)
    );
  });
  it("updateReportByCandId", async function () {
    sandbox.stub(validationResult, "withDefaults").returns({
      isEmpty: sandbox.stub().returns(true),
    });
    const req = {
      params: {
        candidateId: "1",
      },
      body: {
        status: "CONSIDER",
      },
      userId: "64e52362e9dbf9c055ab5cba",
    };
    const report = new reportModel({
      status: "CLEAR",
      adjudication: "",
      package: "Employee Pro",
      turnAroundTime: "NA",
      _id: "1",
    });
    const candidate = new Candidate({
      _id: "1",
      name: "divya",
      email: "cand@gmail.com",
      phone: 1234567890,
      dob: "1990-01-09T00:00:00.000Z",
      location: "Some City",
      zipCode: 12345,
      socialSecurity: 123456789,
      driverLicense: 1234567890678678,
      reports: report,
      user: "64e52362e9dbf9c055ab5cba",
    });

    sandbox.stub(Candidate, "findById").returns(candidate);
    sandbox.stub(Candidate.prototype, "save");

    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    await updateReportByCandId(req, res, () => {});
    expect(res.status.args[0][0]).to.equal(200);
    expect(JSON.stringify(res.json.args[0][0].message)).to.equal(
      JSON.stringify("updated report")
    );
  });
  afterEach(() => sandbox.restore());
});
