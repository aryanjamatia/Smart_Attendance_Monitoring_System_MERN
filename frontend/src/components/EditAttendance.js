import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EditAttendance = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [calendar, setCalendar] = useState([]);
    const [message, setMessage] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);

    // ✅ Added API Base URL
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [calendarRes, studentsRes, attendanceRes] = await Promise.all([
                // Updated call
                axios.get(`${API_BASE_URL}/api/calendar`),
                // Updated call
                axios.get(`${API_BASE_URL}/api/students`),
                // Updated call
                axios.get(`${API_BASE_URL}/api/attendance/${id}`)
            ]);
            
            setCalendar(calendarRes.data);
            const foundStudent = studentsRes.data.find(s => s._id === id);
            setStudent(foundStudent);
            setAttendanceData(attendanceRes.data);

        } catch (err) {
            console.error('Error fetching data:', err);
            setMessage('Error fetching student data.');
        }
    };

    const handleUpdateAttendance = async (date, status) => {
        try {
            // Updated call
            // Note: The date is sent as an ISO string for consistent parsing on the server
            await axios.put(`${API_BASE_URL}/api/attendance/${id}/${date.toISOString()}`, { status });
            setMessage(`Attendance for ${new Date(date).toLocaleDateString()} updated successfully!`);
            fetchData(); // Re-fetch to update the state
        } catch (err) {
            setMessage('Error updating attendance.');
        }
    };

    const getAttendanceStatus = (date) => {
        const record = attendanceData.find(att => new Date(att.date).toDateString() === new Date(date).toDateString());
        return record ? record.status : 'N/A';
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="w-full max-w-4xl mx-auto">
                <Link to="/admin" className="text-blue-600 mb-6 inline-block font-medium">← Back to Admin Dashboard</Link>
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Edit Attendance</h1>
                
                {student && (
                    <div className="p-8 bg-white rounded-xl shadow-lg mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            Student Details
                        </h2>
                        <p className="text-gray-600 mt-2">**Roll No:** {student.rollNo}</p>
                        <p className="text-gray-600">**Name:** {student.name}</p>
                    </div>
                )}

                <div className="p-8 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                        Attendance Records
                    </h2>
                    {calendar.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {calendar.map(classDay => {
                                        const date = new Date(classDay.date);
                                        const status = getAttendanceStatus(date);
                                        return (
                                            <tr key={classDay._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {date.toLocaleDateString()}
                                                </td>
                                                <td className={`py-4 px-4 whitespace-nowrap text-sm font-medium ${status === 'P' ? 'text-green-600' : status === 'A' ? 'text-red-600' : 'text-gray-500'}`}>
                                                    {status === 'P' ? 'Present' : status === 'A' ? 'Absent' : 'N/A'}
                                                </td>
                                                <td className="py-4 px-4 whitespace-nowrap text-sm text-center space-x-2">
                                                    <button
                                                        onClick={() => handleUpdateAttendance(date, 'P')}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-medium"
                                                    >
                                                        Mark P
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateAttendance(date, 'A')}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium"
                                                    >
                                                        Mark A
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">No class days have been added yet.</p>
                    )}
                    {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default EditAttendance;