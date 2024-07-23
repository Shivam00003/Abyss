const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, validateReview ,isReviewAuthor } = require("../middlewares.js");
const reviewControllers = require("../controllers/reviews.js");


// Reviews
router.post("/", validateReview, isLoggedIn, asyncWrap(reviewControllers.createReview));


// Delete Reviews 
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, asyncWrap(reviewControllers.destroyReview));

module.exports = router;