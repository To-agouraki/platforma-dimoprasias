const express = require("express");
const { check } = require("express-validator");

const adminOperationsController = require("../controllers/admin_operations-controllers");

const ImageUpload = require("../middleware/file-upload");
const router = express.Router();

router.post("/login", adminOperationsController.login);

router.get("/categories", adminOperationsController.getCategories);

router.get(
  "/getCategory/:categoryId",
  adminOperationsController.getCategoryById
);

router.post(
  "/createCategory",
  [check("name").not().isEmpty(), check("description").isLength({ max: 2000 })],
  adminOperationsController.createCategory
);

router.patch(
  "/updateCategory/:categoryId",
  [check("name").not().isEmpty(), check("description").isLength({ max: 2000 })],
  adminOperationsController.updateCategory
);
router.delete(
  "/deleteCategory/:categoryId",
  adminOperationsController.deleteCategory
);

router.patch(
  "/updateuser/:uid",
  ImageUpload.single("image"),
  [check("name").not().isEmpty()],
  adminOperationsController.updateNormalUser
);

module.exports = router;
