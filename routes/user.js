const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { use } = require("passport");
const router = express.Router();
const User=require("../models/users.js");
const passport = require("passport");
const { register } = require("../models/review.js");
const {saveRedirectUrl}=require("../middlewares.js");
const userController=require("../controllers/users.js");
const ExpressError = require("../utils/ExpressError.js");

// getting user details 
router.get("/signUp",userController.getSignupUserDetails);

// saving it into the database
router.post("/signUp",wrapAsync(userController.saveItToDataBase));

// getting user details
router.get("/login",userController.getLoginUserDetails);

// authorizing user details
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),
    wrapAsync(userController.loginAuthorization)
);

// logging out
router.get("/logout",userController.logoutUser);

module.exports=router;