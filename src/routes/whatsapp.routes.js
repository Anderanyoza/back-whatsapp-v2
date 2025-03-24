const express = require("express");
const WhastappController = require("../controllers/whatsapp.controller");
const router = express.Router();

router.post("/send", WhastappController.sendMessage);
router.post("/send-image", WhastappController.sendImages);
module.exports = router;
