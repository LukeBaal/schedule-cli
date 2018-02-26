const mongoose = require('mongoose');

//Schedule Schema
const scheduleSchema = mongoose.Schema({
  day: { type: String },
  from: { type: String },
  to: { type: String },
  category: { type: String },
  week: { type: String },
  course: { type: String },
  location: { type: String}
});

//Define and export
module.exports = mongoose.model('Schedule', scheduleSchema);