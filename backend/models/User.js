const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
username: {
    type  : String,
    require: true, 
    unique: false,
}, 
email: {
    type: String, 
    required: true,
    unique: true,
}, 
password: {
    type: String,
    required: true,
},
role: {
    type: String, 
    default: "user"
}

}, {timestamp: true}
);

const User = mongoose.model("User", userSchema); 
module.exports = User; 