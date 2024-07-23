const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const asyncWrap=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const flash = require("connect-flash");
const {isLoggedIn,isOwner,validateListing} = require("../middlewares.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});


router
    .route("/")
    //Index Route
    .get(asyncWrap(listingController.index))
    //Create Route
    .post( isLoggedIn, upload.single('listing[image]'), validateListing, asyncWrap(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
    .route("/:id")
    //Show Route
    .get(asyncWrap(listingController.showListing))
    //Update Route
    .put(isLoggedIn,upload.single('listing[image]'), validateListing,isOwner, asyncWrap(listingController.updateListing))
    //Delete Route
    .delete(isLoggedIn,isOwner, asyncWrap(listingController.deleteListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, asyncWrap(listingController.renderEditForm));

module.exports=router;