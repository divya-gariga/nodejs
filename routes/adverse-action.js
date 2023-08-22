const express = require("express");
const { body } = require("express-validator");

const adverseActionController = require("../controllers/adverse-action");
const isAuth = require("../middleware/is-auth");
const { validateObjectId } = require("../util/validations/id-validator");
const { adverseActionStatusEnum } = require("../models/adverse-action");

const router = express.Router();

router.get("/", isAuth, adverseActionController.getAdverseActions);

router.post(
  "/",
  isAuth,
  [
    validateObjectId("candidate"),
    body("status")
      .notEmpty()
      .withMessage("provide status")
      .bail()
      .customSanitizer((value) => value.toUpperCase())
      .isIn(adverseActionStatusEnum)
      .withMessage("Invalid status"),
    body("prenoticeDate", "provide valid prenoticeDate").optional()
      .trim()
      .isDate({ format: "YYYY-MM-DD" }),
  ],
  adverseActionController.createAdverseAction
);

module.exports = router;
