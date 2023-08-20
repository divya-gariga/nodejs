const express = require("express");

const courtSearchController = require("../controllers/court-search");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, courtSearchController.getCourtSearches);

router.post("/", isAuth, courtSearchController.createCourtSearches);

router.get(
  "/:candidateId",
  isAuth,
  courtSearchController.getCourtSearchesByCandId
);

module.exports = router;
