const mongoose = require("mongoose");
const contactSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("contact", contactSchema);
