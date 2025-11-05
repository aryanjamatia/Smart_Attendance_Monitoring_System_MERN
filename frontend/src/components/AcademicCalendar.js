import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AcademicCalendar = () => {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({ date: '' });
    const [message, setMessage] = useState('');

    // ✅ Added API Base URL
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            // Updated call
            const res = await axios.get(`${API_BASE_URL}/api/calendar`);
            setClasses(res.data);
        } catch (err) {
            console.error('Error fetching class days:', err);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            // Updated call
            await axios.post(`${API_BASE_URL}/api/calendar`, {
                date: newClass.date,
                event: 'Class Day' // Default title since it's not needed by the user
            });
            setMessage('Class day added successfully!');
            setNewClass({ date: '' });
            fetchClasses();
        } catch (err) {
            setMessage('Error adding class day.');
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="w-full max-w-2xl mx-auto">
                <Link to="/admin" className="text-blue-600 mb-6 inline-block font-medium">← Back to Admin Dashboard</Link>
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Academic Class Calendar</h1>

                <div className="p-8 bg-white rounded-xl shadow-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">Add New Class Day</h2>
                    <form onSubmit={handleAddClass} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Date</label>
                            <input
                                type="date"
                                value={newClass.date}
                                onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transform transition-transform hover:scale-105"
                        >
                            Add Class
                        </button>
                        {message && <p className="mt-4 text-center text-sm text-blue-600">{message}</p>}
                    </form>
                </div>

                <div className="p-8 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">Scheduled Class Days</h2>
                    {classes.length === 0 ? (
                        <p className="text-gray-500 text-center">No class days found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {classes.map((item, index) => (
                                <li key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                    <p className="font-bold text-gray-800">{new Date(item.date).toLocaleDateString()}</p>
                                    <p className="font-semibold text-gray-700">{item.event}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendar;