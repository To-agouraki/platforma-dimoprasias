const express = require("express");
const { check } = require("express-validator");

const Authchecking = require("../middleware/check-auth");
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();
const ImageUpload = require("../middleware/file-upload");

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.get("/market/:uid", placesControllers.getPlacesMarket);

router.get("/market/loggedout/general", placesControllers.getAllItemsMarket);

router.get("/items/getPopularItems", placesControllers.getPopularItems);

router.get(
  "/deactivatedItems/items",
  placesControllers.getDeactivatedItemsAdmin
);

router.get("/newarrivals/newitems", placesControllers.getNewArrivals);

router.get("/categoryItems/:categoryId", placesControllers.getPlacesByCategory);

router.use(Authchecking);

router.post(
  "/",
  ImageUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("category").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  ImageUpload.single("image"),
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.post(
  "/biditem",
  [
    check("amount")
      .notEmpty()
      .withMessage("Number is required")
      .isFloat({ gt: 0, min: 0 })
      .withMessage("Number must be positive"),
  ],
  placesControllers.bidItem
);

router.delete("/:pid", placesControllers.deletePlace);
router.patch("/deactivate/:pid", placesControllers.deactivatePlace);

module.exports = router;
