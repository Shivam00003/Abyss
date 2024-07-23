if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// const MONGO_URL = "mongodb://127.0.0.1:27017/Abyss";
const DB_URL = process.env.ATLAS_URL; // tO CONNECT TO ONLINE CLOUD

const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  await mongoose.connect(DB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


// app.get("/", (req, res) => {
//   res.send("Welcome , to Abyss!!!!");
// });

const store = MongoStore.create({
  mongoUrl : DB_URL,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter : 24 * 3600
});

store.on("error",() => {
  console.log("ERROR in MONGO-SESSION STORE : ",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.Curruser=req.user;
  next();
});



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);


// if user tries to go to any invalid page
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found !"));
});

// Handling The Error
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error Occurred !!" } = err;
  // res.status(status).send(message);
  res.render("error.ejs", { message });
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});