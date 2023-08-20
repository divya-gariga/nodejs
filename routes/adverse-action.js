const express = require("express");

const adverseActionController = require("../controllers/adverse-action");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, adverseActionController.getAdverseActions);

router.post("/", isAuth, adverseActionController.createAdverseAction);

module.exports = router;
