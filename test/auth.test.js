const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sandbox = sinon.createSandbox();
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Candidate = require("../models/candidate");
const { signup, login } = require("../controllers/auth");

describe("Auth Controller", () => {
  describe("signup", () => {
    it("signup - email already exits", async function () {
      sandbox.stub(validationResult, "withDefaults").returns({
        isEmpty: sandbox.stub().returns(true),
      });
      sandbox.stub(User, "findOne").returns(
        new User({
          _id: "1",
          email: "test@gmail.com",
          password: "test@123",
        })
      );
      const req = {
        body: {
          email: "test@gmail.com",
          password: "test@123",
        },
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      const next = sinon.spy();
      await signup(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(422);
      expect(next.args[0][0].message).to.equal("Validation failed");
    });
    it("signup - successful", async function () {
      sandbox.stub(validationResult, "withDefaults").returns({
        isEmpty: sandbox.stub().returns(true),
      });
      sandbox.stub(User, "findOne").returns(null);
      sandbox.stub(User.prototype, "save").returns(
        new User({
          _id: "1",
          email: "test@gmail.com",
          password: "test@123",
        })
      );
      const req = {
        body: {
          email: "test@gmail.com",
          password: "test@123",
        },
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      sandbox.stub(bcrypt, "hash").returns("test@123");
      const next = sinon.spy();
      await signup(req, res, next);
      expect(res.status.args[0][0]).to.equal(201);
      expect(res.json.args[0][0].message).to.equal("User created!");
    });
  });
  describe("login", () => {
    it("login successful", async function () {
      sandbox.stub(validationResult, "withDefaults").returns({
        isEmpty: sandbox.stub().returns(true),
      });
      const req = {
        body: {
          email: "test@gmail.com",
          password: "test@123",
        },
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      sinon
        .stub(User, "findOne")
        .returns({ _id: "1", email: "test@gmail.com", password: "test@123" });
      sinon.stub(bcrypt, "compare").returns(true);
      sinon.stub(jwt, "sign").returns("token");
      const next = sinon.spy();
      await login(req, res, next);
      expect(res.status.args[0][0]).to.be.equal(200);
      expect(res.json.args[0][0].token).to.be.equal("token");
    });
    it("login unsuccessful", async function () {
      sandbox.stub(validationResult, "withDefaults").returns({
        isEmpty: sandbox.stub().returns(true),
      });
      const req = {
        body: {
          email: "test@gmail.com",
          password: "test@123",
        },
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      };
      sinon.stub(User, "findOne").returns(null);
      const next = sinon.spy();
      await login(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(401);
      expect(next.args[0][0].message).to.equal("unable to login");
      expect(next.args[0][0].data[0]).to.equal(
        "A user with this email could not be found."
      );
    });
  });

  afterEach(() => {
    sandbox.restore(), sinon.restore();
  });
});
