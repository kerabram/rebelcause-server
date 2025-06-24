//NO TOUCHY FROM NOW ON
const { time } = require("console");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const submitprotestSchema = new Schema({
  location: {
    type: String,
    required: true,
    trim: true,
  },

  date: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const SubmitProtest= mongoose.model("SubmitProtest", submitprotestSchema);

module.exports = SubmitProtest;