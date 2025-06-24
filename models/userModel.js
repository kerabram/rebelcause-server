//NO TOUCHY FROM NOW ON
const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
    // firstName: {
    //     type: String,
    //     required: true,
    //     trim: true,
    // },
    // lastName: {
    //     type: String,
    //     trim: true,
    // }, -- Alias
    //more values 
    alias: {
      required: true,
        unique: true,
        trim: true,
    },
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true,
    //     lowercase: true,
    //   },
      password: {
        type: String,
        required: true,
        minLength: 8,
      },
      //ONLY ADDITIONS TO MODEL
      googleId: {
        type: String,
      },
      //Kit: GitHub Auth is optional
      githubId: {
        type: String,
      },
    //ONLY ADDITIONS TO MODEL
})

const User = mongoose.model("User", userSchema);

module.exports = User;