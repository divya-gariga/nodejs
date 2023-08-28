const { expect } = require("chai");
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
const { validationResult } = require("express-validator");
const { AdverseAction } = require("../models/adverse-action");
const Candidate = require("../models/candidate");
const {
  getAdverseActions,
  createAdverseAction,
} = require("../controllers/adverse-action");

describe("Adverse Actions Controller", () => {
  it("getAdverseActions with succesfull status", async function () {
    const req = {
      userId: "64e52362e9dbf9c055ab5cba",
    };

    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };

    const adverseActionsMock = [
      {
        _id: "1",
        status: "CLEAR",
        prenoticeDate: "2023-08-08",
        postnoticeDate: "2023-08-08",
        candidate: {
          user: "64e52362e9dbf9c055ab5cba",
        },
      },
    ];
    const findStub = sinon.stub(AdverseAction, "find").returns({
      populate: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(adverseActionsMock),
    });
    const next = sinon.spy();
    await getAdverseActions(req, res, next);
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(
      res.json.calledOnceWithMatch({
        message: "Fetched Adverse Actions successfully.",
        data: adverseActionsMock,
      })
    ).to.be.true;
  });
  it("getAdverseActions with unsuccesfull status", async function () {
    const req = {
      userId: "64e52362e9dbf9c055ab5cba",
    };

    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };

    const findStub = sinon.stub(AdverseAction, "find").returns({
      populate: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(null),
    });
    const next = sinon.spy();
    await getAdverseActions(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(next.args[0][0].statusCode).to.equal(500);
    expect(next.args[0][0].message).to.equal(
      "Fetching Adverse Actions Failed."
    );
  });
  it("createAdverseAction with success status", async function () {
    sandbox.stub(validationResult, "withDefaults").returns({
      isEmpty: sandbox.stub().returns(true),
    });
    sandbox.stub(Candidate, "findById").returns(
      new Candidate({
        _id: "1",
        user: "64e52362e9dbf9c055ab5cba",
      })
    );
    sandbox.stub(AdverseAction.prototype, "save");
    const req = {
      body: {
        status: "CLEAR",
        prenoticeDate: "08-08-2023",
        candidate: "1",
      },
      userId: "64e52362e9dbf9c055ab5cba",
    };
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    await createAdverseAction(req, res, () => {});
    expect(res.status.args[0][0]).to.equal(200);
    expect(JSON.stringify(res.json.args[0][0])).to.equal(
      JSON.stringify({ message: "Adverse Action created." })
    );
  });
  it("createAdverseAction with error ", async function () {
    sandbox.stub(validationResult, "withDefaults").returns({
      isEmpty: sandbox.stub().returns(true),
    });
    sandbox.stub(Candidate, "findById").returns(
      new Candidate({
        _id: "1",
        user: "64e52362e9dbf9c055ab5cba",
      })
    );
    sandbox.stub(AdverseAction.prototype, "save");
    const req = {
      body: {
        status: "CLEAR",
        prenoticeDate: "08-08-2023",
        candidate: "1",
      },
      userId: "64e48b5b8840be8aa29a5b73",
    };
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    const next = sinon.spy();
    const status = await createAdverseAction(req, res, next);
    expect(next.called).to.be.true;
    expect(next.args[0][0].statusCode).to.equal(403);
    expect(next.args[0][0].message).to.equal(
      "Creating Adverse Actions Failed."
    );
    expect(JSON.stringify(next.args[0][0].data)).to.equal(
      JSON.stringify(["Not authorized"])
    );
  });
  afterEach(() => {
    sandbox.restore(), sinon.restore();
  });
});
