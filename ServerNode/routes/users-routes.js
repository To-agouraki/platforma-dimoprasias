const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const ImageUpload = require("../middleware/file-upload");
const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.patch(
  "/updateuser/:uid",
  ImageUpload.single("image"),
  [check("name").not().isEmpty()],
  usersController.updateUser
);

router.post("/login", usersController.login);

router.get("/getuser/:uid", usersController.getOnetUsers);
router.get("/getuserbids/:uid", usersController.getBiddersItems);

module.exports = router;
