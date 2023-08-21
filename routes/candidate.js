const express = require("express");

const candidateController = require("../controllers/candidate");

const router = express.Router();

router.get("/", candidateController.getCandidates);

router.post("/", candidateController.createCandidate);

router.get("/reports/:candidateId", candidateController.getReportByCandId);

router.patch("/reports/:candidateId", candidateController.updateReportByCandId);

router.get("/:candidateId", candidateController.getCandidate);

router.delete("/:candidateId", candidateController.deleteCandidate);

module.exports = router;
