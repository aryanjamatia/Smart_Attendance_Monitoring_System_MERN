const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student', // This is the foreign key reference
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['P', 'A'],
        required: true
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
