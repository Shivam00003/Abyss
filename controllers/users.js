const User=require("../models/users.js");

module.exports.getSignupUserDetails = async(req,res) => {
    res.render("listings/signUpForm.ejs");
}

module.exports.saveItToDataBase = async(req,res) => {
    try {
        let {username ,email ,password }=req.body;
        const newUser=new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if (err) {
                return next(err);
            }
            req.flash("success","Welcome to Abyss !");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signUp");
    }
}

module.exports.getLoginUserDetails = async(req,res) => {
    res.render("listings/logInForm.ejs");
}

module.exports.loginAuthorization = async(req,res) => {
    req.flash("success","Welcome Back to Abyss !");
    let redirectUrl=res.locals.url || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res,next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are Logged Out!");
        res.redirect("/listings");
    })
}