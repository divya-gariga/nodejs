const express = require("express");

const courtSearchController = require("../controllers/court-search");

const router = express.Router();

router.get("/", courtSearchController.getCourtSearches);

router.post("/", courtSearchController.createCourtSearches);

router.get("/:candidateId", courtSearchController.getCourtSearchesByCandId);

module.exports = router;
