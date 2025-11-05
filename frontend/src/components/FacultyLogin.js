import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const FacultyLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // ✅ Added API Base URL
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Updated call
            const res = await axios.post(`${API_BASE_URL}/api/login`, { username, password });
            if (res.data.role === 'faculty') {
                navigate('/faculty');
            } else {
                setMessage('Invalid credentials for Faculty portal.');
            }
        } catch (err) {
            setMessage('Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Faculty Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        Login
                    </button>
                    {message && <p className="mt-4 text-red-500 text-center text-sm">{message}</p>}
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-2">Login as:</p>
                    <div className="flex flex-col justify-center space-y-2">
                        <Link to="/admin-login" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-lg transform transition-transform hover:scale-105">Admin</Link>
                        <Link to="/student-login" className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold text-lg transform transition-transform hover:scale-105">Student</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyLogin;