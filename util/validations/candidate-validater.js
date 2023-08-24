const { body } = require("express-validator");

module.exports = {
  candidateValidator: [
    body("name").notEmpty().withMessage("Please enter name").normalizeEmail(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("phone")
      .trim()
      .isLength(10)
      .isInt()
      .withMessage("provide valid phone number"),
    body("dob", "provide valid dob")
      .trim()
      .notEmpty()
      .withMessage("dob is required.")
      .bail()
      .isDate({ format: "YYYY-MM-DD" }),
    body("location").trim().notEmpty().withMessage("provide location"),
    body("zipCode").trim().notEmpty().withMessage("provide zip code"),
    body("socialSecurity")
      .trim()
      .custom((value) => {
        if (!value || value.length !== 9 || isNaN(value)) {
          throw new Error("Provide a valid 9-digit social security number");
        }
        return true;
      }),
    body("driverLicense")
      .trim()
      .isLength(16)
      .withMessage("provide valid driver license number"),
  ],
};
