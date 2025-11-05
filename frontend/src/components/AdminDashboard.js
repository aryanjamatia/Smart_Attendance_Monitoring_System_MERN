import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [students, setStudents] = useState([]);
    const [rollNo, setRollNo] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', rollNo: '', id: '' });
    const [searchTerm, setSearchTerm] = useState('');

    // ✅ Added API Base URL
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

    //  reference to scroll into view
    const editFormRef = useRef(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            // Updated call
            const res = await axios.get(`${API_BASE_URL}/api/students`);
            const sortedStudents = res.data.sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo));
            setStudents(sortedStudents);
        } catch (err) {
            console.error('Error fetching students:', err);
            setMessage('Error fetching students.');
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            // Updated call
            await axios.post(`${API_BASE_URL}/api/students`, { name, rollNo });
            setMessage('Student added successfully!');
            setName('');
            setRollNo('');
            fetchStudents();
        } catch (err) {
            setMessage('Error adding student.');
        }
    };

    const handleEditClick = (student) => {
        setIsEditing(true);
        setEditForm({ name: student.name, rollNo: student.rollNo, id: student._id });

        // Scroll smoothly to edit form
        setTimeout(() => {
            editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            // Updated call
            await axios.put(`${API_BASE_URL}/api/students/${editForm.id}`, { name: editForm.name, rollNo: editForm.rollNo });
            setMessage('Student updated successfully!');
            setIsEditing(false);
            setEditForm({ name: '', rollNo: '', id: '' });
            fetchStudents();
        } catch (err) {
            setMessage('Error updating student.');
        }
    };

    const handleDeleteStudent = async (id) => {
        try {
            // Updated call
            await axios.delete(`${API_BASE_URL}/api/students/${id}`);
            setMessage('Student deleted successfully!');
            fetchStudents();
        } catch (err) {
            setMessage('Error deleting student.');
        }
    };

    //  Filter students based on search term
    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toString().includes(searchTerm)
    );

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="w-full max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Admin Dashboard</h1>

                {/* Calendar Section */}
                <div className="bg-white p-8 rounded-xl shadow-lg mb-6 text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Academic Calendar</h2>
                    <p className="text-gray-600 mb-4">Manage academic events and holidays.</p>
                    <Link
                        to="/admin/calendar"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transform transition-transform hover:scale-105"
                    >
                        Go to Calendar
                    </Link>
                </div>

                {/* Add/Edit Student Section */}
                <div ref={editFormRef} className="p-8 bg-white rounded-xl shadow-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                        {isEditing ? 'Edit Student Details' : 'Add New Student'}
                    </h2>
                    <form onSubmit={isEditing ? handleUpdateStudent : handleAddStudent} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={isEditing ? editForm.name : name}
                                onChange={(e) =>
                                    isEditing
                                        ? setEditForm({ ...editForm, name: e.target.value })
                                        : setName(e.target.value)
                                }
                                placeholder="e.g., aryan"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Roll No</label>
                            <input
                                type="text"
                                value={isEditing ? editForm.rollNo : rollNo}
                                onChange={(e) =>
                                    isEditing
                                        ? setEditForm({ ...editForm, rollNo: e.target.value })
                                        : setRollNo(e.target.value)
                                }
                                placeholder="e.g., 01"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className={`w-full text-white py-3 rounded-lg text-lg font-semibold transform transition-transform hover:scale-105 ${
                                    isEditing ? 'bg-blue-600' : 'bg-green-600'
                                }`}
                            >
                                {isEditing ? 'Update Student' : 'Add Student'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-full bg-gray-500 text-white py-3 rounded-lg text-lg font-semibold transform transition-transform hover:scale-105"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                        {message && (
                            <p
                                className={`mt-4 text-center text-sm ${
                                    message.startsWith('Error') ? 'text-red-500' : 'text-green-600'
                                }`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                {/* All Students Section */}
                <div className="p-8 bg-white rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">All Students (Sorted by Roll No)</h2>
                        <input
                            type="text"
                            placeholder="Search by Roll No or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {filteredStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Roll No
                                        </th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {student.rollNo}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                                                {student.name}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-center space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(student)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <Link
                                                    to={`/admin/edit-attendance/${student._id}`}
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-medium"
                                                >
                                                    Edit Attendance
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteStudent(student._id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">No students found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;