const express = require("express");
const router = express.Router();
const { getIndex } = require("../controllers/index");
/* GET users listing. */
router.get("/", getIndex);

module.exports = router;
