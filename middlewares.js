const Listing = require("./models/listing.js");
const asyncWrap = require("./utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const flash = require("connect-flash");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.url = req.originalUrl;
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.url) {
        res.locals.url = req.session.url;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (listing.owner && !listing.owner._id.equals(res.locals.Curruser._id)) {
        req.flash("error", "You donot have permission to edit !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// validator for edit and create form
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

// validator for review form
module.exports.validateReview = (req, res, next) => {
    // console.log(reviewSchema.validate(req.body));
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!res.locals.Curruser._id.equals(review.author._id)) {
        req.flash("error", "You are not the Author of this Review !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}