const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
// Should adjust the provider to be an object and to store the access token and id, but it works as is atm
const ProfileSchema = new Schema({
  provider: [{ type: String, unique: true }],
  email: { type:String, required: true, unique: true },
  name: String,
  displayName: String,
  accessToken: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Profile", ProfileSchema);