const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const AcademicCalendar = require('./models/AcademicCalendar');
const Attendance = require('./models/Attendance');

dotenv.config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(DB_URL)
  .then(() => console.log('✅ MongoDB Atlas connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- API Routes ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'aryan' && password === '12345') {
    return res.json({ role: 'admin', message: 'Admin login successful.' });
  }
  if (username === 'samiran' && password === '12345') {
    return res.json({ role: 'faculty', message: 'Faculty login successful.' });
  }
  const student = await Student.findOne({ name: username, rollNo: password });
  if (student) {
    const studentAttendance = await Attendance.find({ studentId: student._id });
    const studentWithAttendance = { ...student.toObject(), attendance: studentAttendance };
    return res.json({ role: 'student', message: 'Student login successful.', student: studentWithAttendance });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Student CRUD routes
app.post('/api/students', async (req, res) => {
  try {
    const { name, rollNo } = req.body;
    const newStudent = new Student({ name, rollNo });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: 'Error adding student', error: err.message });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: 'Error updating student', error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
});

// Academic Calendar
app.post('/api/calendar', async (req, res) => {
  try {
    const newEvent = new AcademicCalendar(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: 'Error adding event', error: err.message });
  }
});

app.get('/api/calendar', async (req, res) => {
  try {
    const events = await AcademicCalendar.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

// Attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const { studentId, status } = req.body;
    const attendanceRecord = new Attendance({ studentId, date: new Date(), status });
    await attendanceRecord.save();
    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error marking attendance', error: err.message });
  }
});

app.put('/api/attendance/:studentId/:date', async (req, res) => {
  try {
    const { studentId, date } = req.params;
    const { status } = req.body;
    const attendanceDate = new Date(date);

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { studentId, date: attendanceDate },
      { status },
      { new: true, upsert: true }
    );
    res.json({ message: 'Attendance updated successfully', updatedAttendance });
  } catch (err) {
    res.status(500).json({ message: 'Error updating attendance', error: err.message });
  }
});

app.get('/api/attendance/:studentId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance', error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
