const express = require("express");
const { check } = require("express-validator");

const adminOperationsController = require("../controllers/admin_operations-controllers");

const ImageUpload = require("../middleware/file-upload");
const router = express.Router();

router.post("/login", adminOperationsController.login);

router.get("/categories", adminOperationsController.getCategories);


router.post(
  "/createCategory",
  [check("name").not().isEmpty(), check("description").isLength({ min: 50 })],
  adminOperationsController.createCategory
);

router.patch(
  "/updateCategory/:categoryId",
  [check("name").not().isEmpty(), check("description").isLength({ min: 50 })],
  adminOperationsController.updateCategory
);
router.delete("/deleteCategory/:categoryId", adminOperationsController.deleteCategory);

module.exports = router;
