const express = require("express");

const courtsearchController = require("../controllers/courtsearch");

const router = express.Router();

router.get("/", courtsearchController.getCourtSearches);

router.post("/", courtsearchController.createCourtSearches);

router.get("/:candidateId", courtsearchController.getCourtSearchesByCandId);

module.exports = router;
