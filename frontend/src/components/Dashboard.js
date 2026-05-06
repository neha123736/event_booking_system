import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Download } from 'lucide-react';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Error state add kiya hai

    // User data fetch with safety check
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : {};

    const fetchBookings = async() => {
        if (!user.id) {
            setError("User session not found. Please login again.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`http://localhost:5000/api/my-bookings/${user.id}`);
            setBookings(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Failed to load bookings. Check if backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async(id) => {
        console.log("Attempting to cancel ID:", id);
        if (!window.confirm("Do you want to cancel your ticket?")) return;

        try {
            const res = await axios.delete(`http://localhost:5000/api/bookings/${id}`);
            if (res.data.success) {
                alert("✅ Booking Cancelled Successfully!");
                fetchBookings();
            } else {
                alert("❌ Cancel fail ho gaya: " + (res.data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Cancel Error Detail:", err.response || err);
            alert(`❌ Error: ${err.response?.data?.message || "Server connection failed"}`);
        }
    };

    if (loading) return <div className = "p-10 text-center font-bold" > Loading... < /div>;

    // Display error message if backend is down
    if (error) return <div className = "p-10 text-center text-red-500 font-bold" > { error } < /div>;

    return ( <
        div className = "p-8 max-w-6xl mx-auto" >
        <
        h1 className = "text-3xl font-black mb-6" > My Dashboard < /h1> <
        div className = "bg-white border rounded-2xl shadow-sm overflow-hidden" >
        <
        table className = "w-full text-left" >
        <
        thead className = "bg-gray-50 border-b" >
        <
        tr >
        <
        th className = "p-4" > Event Name < /th> <
        th className = "p-4" > Ticket ID < /th> <
        th className = "p-4" > Price < /th> <
        th className = "p-4 text-center" > Action < /th> < /
        tr > <
        /thead> <
        tbody > {
            bookings.length > 0 ? (
                bookings.map((b) => ( <
                    tr key = { b.id }
                    className = "border-b hover:bg-gray-50" >
                    <
                    td className = "p-4 font-bold" > { b.event_title } < /td> <
                    td className = "p-4 text-blue-600 font-mono" > { b.ticket_id } < /td> <
                    td className = "p-4" > ₹{ b.total_price } < /td> <
                    td className = "p-4 flex justify-center gap-4" >
                    <
                    button onClick = {
                        () => window.print()
                    }
                    className = "text-gray-400 hover:text-blue-500"
                    title = "Download Ticket" >
                    <
                    Download size = { 20 }
                    /> < /
                    button > <
                    button onClick = {
                        () => handleCancel(b.id)
                    }
                    className = "text-gray-400 hover:text-red-500"
                    title = "Cancel Booking" >
                    <
                    Trash2 size = { 20 }
                    /> < /
                    button > <
                    /td> < /
                    tr >
                ))
            ) : null
        } <
        /tbody> < /
        table > {
            bookings.length === 0 && ( <
                p className = "p-10 text-center text-gray-400" > No bookings yet! < /p>
            )
        } <
        /div> < /
        div >
    );
};

export default Dashboard;