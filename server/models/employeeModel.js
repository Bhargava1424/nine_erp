const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  role: String,
  phoneNumber: String,
  branch: String,
  username: String,
  password: String, // Consider encrypting this before saving!
  // Add any other fields you need
});

module.exports = mongoose.model('Employee', employeeSchema);
