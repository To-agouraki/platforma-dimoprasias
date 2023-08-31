const express = require("express");
const { check } = require("express-validator");

const adminOperationsController = require("../controllers/admin_operations-controllers");

const ImageUpload = require("../middleware/file-upload");
const router = express.Router();

router.post("/login", adminOperationsController.login);

module.exports= router;