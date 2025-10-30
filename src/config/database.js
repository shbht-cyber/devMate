const mongoose = require("mongoose");
const dbConnectionURL =
  "mongodb+srv://shobhitraj1998:Shbht%40123@devmate.m3yakb1.mongodb.net/devMate";

async function connectDB() {
  await mongoose.connect(dbConnectionURL);
}

module.exports = {
  connectDB,
};
