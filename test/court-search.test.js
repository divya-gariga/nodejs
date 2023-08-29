const { expect } = require("chai");
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
const { validationResult } = require("express-validator");
const { CourtSearch } = require("../models/court-search");
const Candidate = require("../models/candidate");
const {
  getCourtSearches,
  createCourtSearches,
  getCourtSearchesByCandId,
} = require("../controllers/court-search");

describe("court-searches Controller", () => {
  describe("create courtsearch", () => {
    it("create CourtSearch with candidate not found error", async function () {
      sandbox.stub(validationResult, "withDefaults").returns({
        isEmpty: sandbox.stub().returns(true),
      });
      sandbox.stub(Candidate, "findOne").returns(null);

      sandbox.stub(CourtSearch.prototype, "save");
      const req = {
        body: {
          search: "Criminal",
          status: "CLEAR",
          candidate: "1",
        },
        userId: "64e52362e9dbf9c055ab5cba",
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      const next = sinon.spy();
      await createCourtSearches(req, res, next);
      expect(next.called).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(404);
      expect(next.args[0][0].message).to.equal(
        "Creating court searches Failed."
      );
      expect(JSON.stringify(next.args[0][0].data)).to.equal(
        JSON.stringify(["Could not find candidate."])
      );
    });
    it("create CourtSearch with success status", async function () {
      sandbox.stub(validationResult, "withDefaults").returns({
        isEmpty: sandbox.stub().returns(true),
      });
      sandbox.stub(Candidate, "findOne").returns(
        new Candidate({
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
        })
      );
      sandbox.stub(CourtSearch.prototype, "save");
      const req = {
        body: {
          search: "Criminal",
          status: "CLEAR",
          candidate: "1",
        },
        userId: "64e52362e9dbf9c055ab5cba",
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      await createCourtSearches(req, res, () => {});
      expect(res.status.args[0][0]).to.equal(200);
      expect(JSON.stringify(res.json.args[0][0])).to.equal(
        JSON.stringify({ message: "court search created." })
      );
    });
    it("create CourtSearch with not authorized error ", async function () {
      sandbox.stub(validationResult, "withDefaults").returns({
        isEmpty: sandbox.stub().returns(true),
      });
      sandbox.stub(Candidate, "findOne").returns(
        new Candidate({
          _id: "1",
          user: "64e52362e9dbf9c055ab5cba",
        })
      );
      sandbox.stub(CourtSearch.prototype, "save");
      const req = {
        body: {
          search: "Criminal",
          status: "CLEAR",
          candidate: "1",
        },
        userId: "64e48b5b8840be8aa29a5b73",
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      const next = sinon.spy();
      const status = await createCourtSearches(req, res, next);
      expect(next.called).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(403);
      expect(next.args[0][0].message).to.equal("Forbidden access!");
      expect(JSON.stringify(next.args[0][0].data)).to.equal(
        JSON.stringify(["Not Authorized!"])
      );
    });
    afterEach(() => sandbox.restore());
  });
  describe("get courtsearches", () => {
    it("get courtsearches with success status", async function () {
      sandbox.stub(CourtSearch, "find").returns([
        new CourtSearch({
          _id: "1",
          search: "sdfgh",
          status: "CLEAR",
          candidateId: "1",
        }),
      ]);
      const req = {
        userId: "64e52362e9dbf9c055ab5cba",
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      await getCourtSearches(req, res, () => {});
      expect(res.status.args[0][0]).to.equal(200);
      expect(JSON.stringify(res.json.args[0][0].message)).to.equal(
        JSON.stringify("Fetched court searches successfully.")
      );
      expect(res.json.args[0][0].data).to.have.lengthOf(1);
    });
    it("get courtsearches with unsuccessfull error", async function () {
      sandbox.stub(CourtSearch, "find").returns(null);
      const req = {
        userId: "64e52362e9dbf9c055ab5cba",
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      const next = sinon.spy();
      await getCourtSearches(req, res, next);
      expect(next.called).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(404);
      expect(next.args[0][0].message).to.equal("Fetching Adverse Actions Failed.");
    });
    afterEach(() => sandbox.restore());
  });

  describe("get getCourtSearches ByCandId", () => {
    it("getCourtSearchesByCandId with success status", async function () {
      const req = {
        params: {
          candidateId: "1",
        },
        userId: "64e52362e9dbf9c055ab5cba",
      };
      sandbox.stub(Candidate, "findById").returns(
        new Candidate({
          _id: "1",
          user: "64e52362e9dbf9c055ab5cba",
        })
      );
      sandbox.stub(CourtSearch, "find").returns([
        new CourtSearch({
          _id: "1",
          search: "sdfgh",
          status: "CLEAR",
          candidateId: "1",
        }),
      ]);
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      await getCourtSearchesByCandId(req, res, () => {});
      expect(res.status.args[0][0]).to.equal(200);
      expect(JSON.stringify(res.json.args[0][0].message)).to.equal(
        JSON.stringify("court searches fetched for given candidate id.")
      );
      expect(res.json.args[0][0].data).to.have.lengthOf(1);
    });
    it("getCourtSearchesByCandId with unsuccessfull error", async function () {
      const req = {
        params: {
          candidateId: "1",
        },
        userId: "64e52362e9dbf9c055ab5cba",
      };
      sandbox.stub(Candidate, "findById").returns(
        new Candidate({
          _id: "1",
          user: "64e52362e9dbf9c055ab5890",
        })
      );
      sandbox.stub(CourtSearch, "find").returns(null);
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      const next = sinon.spy();
      await getCourtSearchesByCandId(req, res, next);
      expect(next.called).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(403);
      expect(next.args[0][0].message).to.equal("Forbidden access!");
    });
    afterEach(() => sandbox.restore());
  });
});
