const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing.reviews.author);
    if (!listing) {
        req.flash("error","The Post You Requested Does Not EXIST!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    // if req.body.listing is empty then ".save()" will throw an error. So, Handle it!!
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //   throw new ExpressError(400,result.error);
    // }
    let {path,filename} = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url=path;
    newListing.image.filename=filename;
    await newListing.save();
    req.flash("success","New Post Created!!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error","The Post You Requested Does Not EXIST!");
        res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/h_100,w_100");
    res.render("listings/edit.ejs", { listing,originalUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send Valid Data For Listings");
    // }
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
        let {path,filename} = req.file;
        listing.image.url=path;
        listing.image.filename=filename;
        await listing.save();
    }
    req.flash("success","Post Updated!!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Post Deleted!!");
    res.redirect("/listings");
}