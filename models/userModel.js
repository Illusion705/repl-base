const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  lowercaseUsername: String,
  password: String,
  adminLevel: Number,
  isBlocked: Boolean,
  isDeleted: Boolean,
  blockReason: String,
  messageCount: Number,
  notifications: {
    type: String,
    info: Schema.Types.Mixed
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;