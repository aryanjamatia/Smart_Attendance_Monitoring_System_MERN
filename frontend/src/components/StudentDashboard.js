import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const location = useLocation();
    const { student } = location.state || { student: { name: 'Guest', rollNo: 'N/A', _id: 'N/A' } };
    const [prediction, setPrediction] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // ✅ Added API Base URL
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

    const predictAttendance = useCallback((currentAttendance, totalClassDays) => {
        const presentClasses = currentAttendance.filter(att => att.status === 'P').length;
        const attendedClasses = currentAttendance.length;
        const totalRemainingClasses = totalClassDays - attendedClasses;

        // --- NEW LOGIC: analyze recent attendance ---
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const recentAttendance = currentAttendance.filter(att => new Date(att.date) > thirtyDaysAgo);
        const recentClasses = recentAttendance.length;
        const recentPresentClasses = recentAttendance.filter(att => att.status === 'P').length;

        let recentPercentage = 0;
        if (recentClasses > 0) {
            recentPercentage = (recentPresentClasses / recentClasses) * 100;
        }
        // --- END NEW LOGIC ---

        if (totalClassDays === 0 || attendedClasses === 0) {
            setPrediction('No attendance data available yet. Please check back after your first class.');
            return;
        }

        const currentPercentage = (presentClasses / attendedClasses) * 100;
        let suggestion = '';

        if (recentPercentage >= 75) {
            suggestion = `Your recent attendance trend is excellent! Your current attendance is ${currentPercentage.toFixed(2)}%. Keep up the great work to maintain your standing.`;
        } else if (recentPercentage > 50 && recentPercentage < 75) {
            let neededToReach75 = Math.ceil((0.75 * totalClassDays) - presentClasses);
            suggestion = `Your attendance over the last month has been ${recentPercentage.toFixed(2)}%. You need to be present for at least ${neededToReach75} of the remaining ${totalRemainingClasses} classes to reach the 75% target.`;
        } else {
            let neededToReach75 = Math.ceil((0.75 * totalClassDays) - presentClasses);
            if (neededToReach75 > totalRemainingClasses) {
                suggestion = `Your attendance is critically low (${currentPercentage.toFixed(2)}%). It is now mathematically impossible to reach 75% attendance. Please contact your MENTOR/DEAN.`;
            } else {
                suggestion = `Your recent attendance is low (${recentPercentage.toFixed(2)}%). To reach 75% overall, you must be present for at least ${neededToReach75} of the remaining ${totalRemainingClasses} classes.`;
            }
        }
        setPrediction(suggestion);
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [calendarRes, attendanceRes] = await Promise.all([
                    // Updated call
                    axios.get(`${API_BASE_URL}/api/calendar`),
                    // Updated call
                    axios.get(`${API_BASE_URL}/api/attendance/${student._id}`)
                ]);

                const studentAttendance = attendanceRes.data;
                const totalClassDays = calendarRes.data.length;

                setAttendanceData(studentAttendance);
                setCalendar(calendarRes.data);
                predictAttendance(studentAttendance, totalClassDays);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        if (student && student._id) {
            fetchAllData();
        }
    }, [student, predictAttendance]);

    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const isPresent = (date) => {
        return attendanceData.some(att => new Date(att.date).toDateString() === date.toDateString() && att.status === 'P');
    };

    const isAbsent = (date) => {
        return attendanceData.some(att => new Date(att.date).toDateString() === date.toDateString() && att.status === 'A');
    };

    const isClassDay = (date) => {
        return calendar.some(classDay => new Date(classDay.date).toDateString() === date.toDateString());
    };

    const days = getDaysInMonth(currentMonth, currentYear);

    const getMonthName = (month) => {
        const date = new Date();
        date.setMonth(month);
        return date.toLocaleString('default', { month: 'long' });
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
                Welcome, {student.name}!
            </h1>
            <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Attendance Insight</h2>
                <p className="text-gray-600 leading-relaxed">
                    {prediction}
                </p>
            </div>

            <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
                    Attendance Calendar
                </h2>
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => setCurrentMonth(currentMonth - 1)}
                        className="p-2 bg-gray-200 rounded-lg"
                    >
                        Previous
                    </button>
                    <h3 className="font-bold text-lg">
                        {getMonthName(currentMonth)} {currentYear}
                    </h3>
                    <button
                        onClick={() => setCurrentMonth(currentMonth + 1)}
                        className="p-2 bg-gray-200 rounded-lg"
                    >
                        Next
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="font-semibold text-gray-700">{day}</div>
                    ))}
                    {Array(days[0].getDay()).fill(null).map((_, index) => (
                        <div key={`empty-${index}`}></div>
                    ))}
                    {days.map((day) => {
                        let cellClass = "p-2 rounded-full";
                        const isToday = day.toDateString() === new Date().toDateString();

                        if (isToday) {
                            cellClass += " bg-gray-300";
                        }

                        if (isClassDay(day)) {
                            if (isPresent(day)) {
                                cellClass += " bg-green-500 text-white";
                            } else if (isAbsent(day)) {
                                cellClass += " bg-red-500 text-white";
                            }
                        }

                        return (
                            <div key={day.toISOString()} className={cellClass}>
                                {day.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;