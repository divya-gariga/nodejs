const express = require("express");
const { body } = require("express-validator");

const candidateController = require("../controllers/candidate");
const isAuth = require("../middleware/is-auth");
const {
  candidateValidator,
} = require("../util/validations/candidate-validater");
const { validateObjectId } = require("../util/validations/id-validator");
const {
  reportStatusEnum,
  reportAdjudicationEnum,
} = require("../models/report");

const router = express.Router();

router.get("/users/", isAuth, candidateController.getCandidatesByUser);

router.post(
  "/",
  isAuth,
  candidateValidator,
  candidateController.createCandidate
);

router.get(
  "/reports/:candidateId",
  isAuth,
  validateObjectId('candidateId'),
  candidateController.getReportByCandId
);

router.patch(
  "/reports/:candidateId",
  isAuth,
  [
    validateObjectId('candidateId'),
    body("status")
      .optional()
      .customSanitizer((value) => value.toUpperCase())
      .isIn(reportStatusEnum)
      .withMessage("Invalid status"),
    body("adjudication")
      .optional()
      .customSanitizer((value) => value.toUpperCase())
      .isIn(reportAdjudicationEnum)
      .withMessage("Invalid adjudication"),
  ],
  candidateController.updateReportByCandId
);

router.get(
  "/:candidateId",
  isAuth,
  // validateObjectId('candidateId'),
  candidateController.getCandidate
);

router.delete(
  "/:candidateId",
  isAuth,
  validateObjectId('candidateId'),
  candidateController.deleteCandidate
);

module.exports = router;
