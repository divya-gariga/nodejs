const express = require("express");
const { body } = require("express-validator");

const { courtSearchStatusEnum } = require("../models/court-search");
const courtSearchController = require("../controllers/court-search");
const isAuth = require("../middleware/is-auth");
const { validateObjectId } = require("../util/validations/id-validator");

const router = express.Router();

router.get("/", isAuth, courtSearchController.getCourtSearches);

router.post(
  "/",
  isAuth,
  [
    validateObjectId('candidateId'),
      body("status").notEmpty().withMessage("provide status").bail()
      .customSanitizer((value) => value.toUpperCase())
      .isIn(courtSearchStatusEnum)
      .withMessage("Invalid status"),
  ],
  courtSearchController.createCourtSearches
);

router.get(
  "/:candidateId",
  isAuth,
  validateObjectId('candidateId'),
  courtSearchController.getCourtSearchesByCandId
);

module.exports = router;
