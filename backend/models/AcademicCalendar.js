const mongoose = require('mongoose');
const { Schema } = mongoose;

const academicCalendarSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

const AcademicCalendar = mongoose.model('AcademicCalendar', academicCalendarSchema);
module.exports = AcademicCalendar;
