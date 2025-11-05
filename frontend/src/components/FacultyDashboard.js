import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyDashboard = () => {
    const [students, setStudents] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [searchRoll, setSearchRoll] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState({});

    // ✅ Added API Base URL
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    });

    const isTodayAClassDay = () => {
        return calendar.some(classDay => {
            const classDate = new Date(classDay.date);
            return classDate.toDateString() === currentDate.toDateString();
        });
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [studentsRes, calendarRes] = await Promise.all([
                    // Updated call
                    axios.get(`${API_BASE_URL}/api/students`),
                    // Updated call
                    axios.get(`${API_BASE_URL}/api/calendar`)
                ]);

                const sortedStudents = studentsRes.data.sort((a, b) => {
                    const rollA = parseInt(a.rollNo, 10);
                    const rollB = parseInt(b.rollNo, 10);
                    return rollA - rollB;
                });

                setStudents(sortedStudents);
                setCalendar(calendarRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchAllData();
    }, []);

    // ✅ mark attendance with local highlight
    const markAttendance = async (studentId, status) => {
        try {
            // Updated call
            await axios.post(`${API_BASE_URL}/api/attendance`, { studentId, status });

            // Update local highlight
            setAttendanceStatus(prev => ({
                ...prev,
                [studentId]: status
            }));

            alert(`Attendance marked as ${status} for this student.`);
        } catch (err) {
            console.error('Error marking attendance:', err);
            alert('Failed to mark attendance.');
        }
    };

    const filteredStudents = students.filter(student =>
        student.rollNo.toLowerCase().includes(searchRoll.toLowerCase())
    );

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Faculty Dashboard</h1>

            {isTodayAClassDay() ? (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <p className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                        Attendance for {formattedDate}
                    </p>

                    {/* 🔍 Search Box */}
                    <div className="mb-4 flex justify-center">
                        <input
                            type="text"
                            value={searchRoll}
                            onChange={(e) => setSearchRoll(e.target.value)}
                            placeholder="Search by Roll No"
                            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {students.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.map(student => (
                                        <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollNo}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-center space-x-2">
                                                <button
                                                    onClick={() => markAttendance(student._id, 'P')}
                                                    className={`px-4 py-2 rounded-lg text-xs font-medium transform transition-transform hover:scale-105 
                                                        ${attendanceStatus[student._id] === 'P'
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-green-100 text-green-700 border border-green-400'
                                                        }`}
                                                >
                                                    Present
                                                </button>
                                                <button
                                                    onClick={() => markAttendance(student._id, 'A')}
                                                    className={`px-4 py-2 rounded-lg text-xs font-medium transform transition-transform hover:scale-105 
                                                        ${attendanceStatus[student._id] === 'A'
                                                            ? 'bg-red-600 text-white'
                                                            : 'bg-red-100 text-red-700 border border-red-400'
                                                        }`}
                                                >
                                                    Absent
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">
                            No students have been added yet. Please add students via the Admin Dashboard.
                        </p>
                    )}
                </div>
            ) : (
                <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
                    <p className="text-xl font-semibold text-gray-700">
                        There are no classes scheduled for today, {formattedDate}.
                    </p>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;