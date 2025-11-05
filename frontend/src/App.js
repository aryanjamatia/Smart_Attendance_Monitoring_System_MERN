import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminLogin from './components/AdminLogin';
import FacultyLogin from './components/FacultyLogin';
import StudentLogin from './components/StudentLogin';
import AcademicCalendar from './components/AcademicCalendar';
import EditAttendance from './components/EditAttendance';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<FacultyLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/faculty-login" element={<FacultyLogin />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/admin/calendar" element={<AcademicCalendar />} />
            <Route path="/admin/edit-attendance/:id" element={<EditAttendance />} />
        </Routes>
    </Router>
);

export default App;