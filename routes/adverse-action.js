const express = require("express");

const adverseActionController = require("../controllers/adverse-action");

const router = express.Router();

router.get("/", adverseActionController.getAdverseActions);

router.post("/", adverseActionController.createAdverseAction);

module.exports = router;
