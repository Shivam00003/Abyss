const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Abyss";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("THE ERROR IS HERE SHIVAM ::--->"+err);
  });
  
  async function main() {
    await mongoose.connect(MONGO_URL);
  }
  
  const initDB = async () => {
    await Listing.deleteMany({})
    .then((result)=>{
      console.log("Data Deleted Successfully!!!!");
    })
    .catch((err)=>{
      console.log("THE ERROR IS WHILE DELETING SHIVAM ::--->"+err);
    });

    // this stores the new owner field we just created by it's own and we donot have to explicitly 
    // add it for each data
    initData.data=initData.data.map((obj) => ({
      ...obj,
      owner:"669cf2315baa5fa2aab3afc3"
    }));
    await Listing.insertMany(initData.data)
    .then((result)=>{
      console.log("Data Inserted Successfully!!!!");
    })
    .catch((err)=>{
      console.log("THE ERROR IS WHILE INSERTING SHIVAM ::--->"+err);
    });

  console.log("data was initialized");
};

initDB();