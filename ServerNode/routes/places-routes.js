const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.post(
  "/biditem",
  [
    check("amount")
      .notEmpty()
      .withMessage("Number is required")
      .isFloat({ gt: 0 })
      .withMessage("Number must be positive"),
  ],
  placesControllers.bidItem
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
