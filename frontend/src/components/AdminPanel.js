import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    LayoutDashboard,
    Calendar,
    Ticket,
    IndianRupee,
    Trash2,
    Plus,
    X,
} from 'lucide-react';

const AdminPanel = () => {
        // States
        const [allUsers, setAllUsers] = useState([]);
        const [allBookings, setAllBookings] = useState([]);
        const [allEvents, setAllEvents] = useState([]);
        const [stats, setStats] = useState({ events: 0, bookings: 0, revenue: 0, users: 0 });
        const [loading, setLoading] = useState(true);
        const [activeTab, setActiveTab] = useState('dashboard');
        const [showModal, setShowModal] = useState(false);

       const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    price: '',
    image_url: '',
    description: '',
    available_seats: 50,
    date_time: '',
    category: ''
});

        // --- FETCH DATA LOGIC ---
        const fetchData = async() => {
            try {
                setLoading(true);
                const [userRes, statsRes, bookingsRes, eventsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/users').catch(() => ({ data: [] })),
                    axios.get('http://localhost:5000/api/admin/stats').catch(() => ({ data: {} })),
                    axios.get('http://localhost:5000/api/admin/bookings').catch(() => ({ data: [] })),
                    axios.get('http://localhost:5000/api/events').catch(() => ({ data: [] }))
                ]);

                setAllUsers(userRes.data);
                setAllBookings(bookingsRes.data);
                setAllEvents(eventsRes.data);

                setStats({
                    events: statsRes.data.events || 0,
                    bookings: statsRes.data.bookings || 0,
                    revenue: statsRes.data.revenue || 0,
                    users: statsRes.data.users || 0
                });
            } catch (err) {
                console.error("❌ Admin Data Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchData();
        }, []);

        // --- DELETE BOOKING LOGIC (ADDED) ---
        const handleDeleteBooking = async(id) => {
            if (!window.confirm("Admin: Are you sure you want to remove this booking record?")) return;

            try {
                // Aapke backend port 5000 aur delete route ke hisaab se
                const res = await axios.delete(`http://localhost:5000/api/bookings/${id}`);
                if (res.data) {
                    alert("✅ Booking removed by Admin!");
                    fetchData(); // List refresh karne ke liye
                }
            } catch (err) {
                console.error(err);
                alert("❌ Admin delete failed.");
            }
        };

        const handleAddEvent = async(e) => {
            e.preventDefault();
            try {
                await axios.post('http://localhost:5000/api/events', newEvent);
                alert("🎉 Event Successfully Added!");
                setShowModal(false);
                setNewEvent({ title: '', location: '', price: '', image_url: '', description: '', available_seats: 50 });
                fetchData();
            } catch (err) {
                alert("Error adding event.");
            }
        };

        const handleDeleteEvent = async(id) => {
            if (window.confirm("Are you sure you want to delete this event?")) {
                try {
                    await axios.delete(`http://localhost:5000/api/events/${id}`);
                    fetchData();
                } catch (err) {
                    alert("Delete failed.");
                }
            }
        };

        const renderContent = () => {
            if (activeTab === 'dashboard') {
                return ( <
                    div className = "grid grid-cols-1 md:grid-cols-4 gap-6" >
                    <
                    StatCard icon = { < Users className = "text-blue-600" / > }
                    label = "Total Users"
                    value = { stats.users }
                    color = "bg-blue-50" / >
                    <
                    StatCard icon = { < Calendar className = "text-purple-600" / > }
                    label = "Total Events"
                    value = { stats.events }
                    color = "bg-purple-50" / >
                    <
                    StatCard icon = { < Ticket className = "text-orange-600" / > }
                    label = "Total Bookings"
                    value = { stats.bookings }
                    color = "bg-orange-50" / >
                    <
                    StatCard icon = { < IndianRupee className = "text-green-600" / > }
                    label = "Revenue"
                    value = { "₹" + stats.revenue }
                    color = "bg-green-50" / >
                    <
                    /div>
                );
            }

            if (activeTab === 'users') {
                return ( <
                    div className = "bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden" >
                    <
                    table className = "w-full text-left" >
                    <
                    thead className = "bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest" >
                    <
                    tr >
                    <
                    th className = "px-8 py-5" > Name < /th> <
                    th className = "px-8 py-5" > Email < /th> <
                    th className = "px-8 py-5" > Role < /th> <
                    /tr> <
                    /thead> <
                    tbody className = "divide-y divide-gray-50" > {
                        allUsers.length > 0 ? allUsers.map((u) => ( <
                            tr key = { u.id }
                            className = "hover:bg-gray-50" >
                            <
                            td className = "px-8 py-5 font-bold text-gray-700" > { u.name } < /td> <
                            td className = "px-8 py-5 text-gray-500" > { u.email } < /td> <
                            td className = "px-8 py-5" >
                            <
                            span className = "bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase" > { u.role } < /span> <
                            /td> <
                            /tr>
                        )) : < tr > < td colSpan = "3"
                        className = "p-10 text-center text-gray-400" > No users found. < /td></tr >
                    } <
                    /tbody> <
                    /table> <
                    /div>
                );
            }

            if (activeTab === 'bookings') {
                return ( <
                    div className = "bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden" >
                    <
                    table className = "w-full text-left" >
                    <
                    thead className = "bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest" >
                    <
                    tr >
                    <
                    th className = "px-8 py-5" > ID < /th> <
                    th className = "px-8 py-5" > Event < /th> <
                    th className = "px-8 py-5" > Tickets < /th> <
                    th className = "px-8 py-5" > Price < /th> <
                    th className = "px-8 py-5 text-right" > Actions < /th> <
                    /tr> <
                    /thead> <
                    tbody className = "divide-y divide-gray-50" > {
                        allBookings.length > 0 ? allBookings.map((b) => ( <
                            tr key = { b.id }
                            className = "hover:bg-gray-50" >
                            <
                            td className = "px-8 py-5 font-mono text-xs text-gray-400" > #BK - { b.id } < /td> <
                            td className = "px-8 py-5 font-bold text-gray-700" > { b.event_title } < /td> <
                            td className = "px-8 py-5 text-gray-600" > { b.tickets } < /td> <
                            td className = "px-8 py-5 text-green-600 font-bold" > ₹{ b.total_price } < /td> <
                            td className = "px-8 py-5 text-right" >
                            <
                            button onClick = {
                                () => handleDeleteBooking(b.id) }
                            className = "p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                            title = "Delete Booking" >
                            <
                            Trash2 size = { 18 }
                            /> <
                            /button> <
                            /td> <
                            /tr>
                        )) : < tr > < td colSpan = "5"
                        className = "p-10 text-center text-gray-400" > No bookings recorded yet. < /td></tr >
                    } <
                    /tbody> <
                    /table> <
                    /div>
                );
            }

            if (activeTab === 'events') {
                return ( <
                    div className = "grid grid-cols-1 md:grid-cols-3 gap-6" > {
                        allEvents.map((ev) => ( <
                            div key = { ev.id }
                            className = "bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm group" >
                            <
                            img src = { ev.image_url }
                            className = "w-full h-44 object-cover rounded-2xl mb-4"
                            alt = { ev.title }
                            /> <
                            h4 className = "font-bold text-gray-800 px-2" > { ev.title } < /h4> <
                            div className = "flex justify-between items-center mt-4 px-2" >
                            <
                            span className = "font-black text-blue-600" > ₹{ ev.price } < /span> <
                            button onClick = {
                                () => handleDeleteEvent(ev.id) }
                            className = "p-2 text-red-400 hover:bg-red-50 rounded-xl" >
                            <
                            Trash2 size = { 18 }
                            /> <
                            /button> <
                            /div> <
                            /div>
                        ))
                    } <
                    /div>
                );
            }
        };

        return ( <
                div className = "flex h-screen bg-[#F8FAFC]" > { /* Sidebar */ } <
                div className = "w-72 bg-[#0F172A] text-white p-6 hidden md:flex flex-col" >
                <
                div className = "flex items-center gap-3 mb-12 px-2" >
                <
                div className = "bg-blue-600 p-2 rounded-xl" > < Calendar size = { 24 }
                /></div >
                <
                h2 className = "text-2xl font-black" > AdminHub < /h2> <
                /div> <
                nav className = "space-y-2 flex-1" >
                <
                NavItem icon = { < LayoutDashboard size = { 20 }
                    />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} / >
                    <
                    NavItem icon = { < Users size = { 20 }
                        />} label="Users List" active={activeTab === 'users'} onClick={() => setActiveTab('users')} / >
                        <
                        NavItem icon = { < Calendar size = { 20 }
                            />} label="Manage Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} / >
                            <
                            NavItem icon = { < Ticket size = { 20 }
                                />} label="All Bookings" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} / >
                                <
                                /nav> <
                                /div>

                                { /* Main */ } <
                                div className = "flex-1 flex flex-col overflow-hidden" >
                                <
                                header className = "bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center" >
                                <
                                h1 className = "text-xl font-black text-gray-800 capitalize" > { activeTab } < /h1> <
                                button onClick = {
                                    () => setShowModal(true) }
                                className = "bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100" >
                                <
                                Plus size = { 18 }
                                /> New Event <
                                /button> <
                                /header>

                                <
                                main className = "flex-1 overflow-y-auto p-8" > {
                                    loading ? ( <
                                        div className = "flex justify-center items-center h-full" >
                                        <
                                        div className = "w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" > < /div> <
                                        /div>
                                    ) : renderContent()
                                } <
                                /main> <
                                /div>

                                { /* Modal */ } {
                                    showModal && ( <
                                        div className = "fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4" >
                                        <
                                        div className = "bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden" >
                                        <
                                        div className = "p-8 border-b flex justify-between items-center bg-slate-50" >
                                        <
                                        h3 className = "text-xl font-black text-slate-800" > Create Event < /h3> <
                                        button onClick = {
                                            () => setShowModal(false) }
                                        className = "text-slate-400 hover:text-slate-600" > < X size = { 24 }
                                        /></button >
                                        <
                                        /div> <
                                        form onSubmit = { handleAddEvent }
                                        className = "p-8 space-y-4" >
                                        <
                                        input required placeholder = "Event Title"
                                        className = "w-full p-4 bg-slate-50 rounded-2xl outline-none"
                                        value = { newEvent.title }
                                        onChange = {
                                            (e) => setNewEvent({...newEvent, title: e.target.value }) }
                                        /> <
                                        input required placeholder = "Location"
                                        className = "w-full p-4 bg-slate-50 rounded-2xl outline-none"
                                        value = { newEvent.location }
                                        onChange = {
                                            (e) => setNewEvent({...newEvent, location: e.target.value }) }
                                        /> <
                                        div className = "grid grid-cols-2 gap-4" >
                                        <
                                        input required type = "number"
                                        placeholder = "Price"
                                        className = "w-full p-4 bg-slate-50 rounded-2xl outline-none"
                                        value = { newEvent.price }
                                        onChange = {
                                            (e) => setNewEvent({...newEvent, price: e.target.value }) }
                                        /> <
                                        input required placeholder = "Image URL"
                                        className = "w-full p-4 bg-slate-50 rounded-2xl outline-none"
                                        value = { newEvent.image_url }
                                        onChange = {
                                            (e) => setNewEvent({...newEvent, image_url: e.target.value }) }
                                        /> <
                                        /div> <
                                        textarea placeholder = "Description"
                                        className = "w-full p-4 bg-slate-50 rounded-2xl h-28 outline-none"
                                        value = { newEvent.description }
                                        onChange = {
                                            (e) => setNewEvent({...newEvent, description: e.target.value }) }
                                        /> <
                                        button type = "submit"
                                        className = "w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition-all" > Publish Now < /button> <
                                        /form> <
                                        /div> <
                                        /div>
                                    )
                                } <
                                /div>
                            );
                        };

                        // Internal Components
                        const NavItem = ({ icon, label, active, onClick }) => ( <
                            div onClick = { onClick }
                            className = { "flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer font-bold transition-all " + (active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200') } > { icon } < span className = "text-sm" > { label } < /span> <
                            /div>
                        );

                        const StatCard = ({ icon, label, value, color }) => ( <
                            div className = "bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6" >
                            <
                            div className = { `p-5 rounded-2xl ${color}` } > { icon } < /div> <
                            div >
                            <
                            p className = "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1" > { label } < /p> <
                            h4 className = "text-3xl font-black text-slate-800" > { value } < /h4> <
                            /div> <
                            /div>
                        );

                        export default AdminPanel;