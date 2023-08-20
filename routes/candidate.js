const express = require("express");

const candidateController = require("../controllers/candidate");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, candidateController.getCandidates);

router.get("/users/", isAuth, candidateController.getCandidatesByUser);

router.post("/", isAuth, candidateController.createCandidate);

router.get(
  "/reports/:candidateId",
  isAuth,
  candidateController.getReportByCandId
);

router.patch(
  "/reports/:candidateId",
  isAuth,
  candidateController.updateReportByCandId
);

router.get("/:candidateId", isAuth, candidateController.getCandidate);

router.delete("/:candidateId", isAuth, candidateController.deleteCandidate);

module.exports = router;
