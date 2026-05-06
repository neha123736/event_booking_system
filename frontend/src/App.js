import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Ticket, LogOut, Shield, LayoutDashboard, User, LogIn } from 'lucide-react';

// Components Import
import Login from './components/Login';
import Register from './components/Register';
import EventDetails from './components/EventDetails';
import Dashboard from './components/Dashboard';
import EventCard from './components/EventCard';
import AdminPanel from './components/AdminPanel';

// --- Navbar Component for better state handling ---
const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
                <Ticket size={32} className="bg-blue-600 text-white p-1.5 rounded-xl group-hover:scale-110 transition-transform" />
                <span className="font-black text-2xl tracking-tight text-gray-900">EventBook</span>
            </Link>

            <div className="flex items-center gap-4 md:gap-8">
                <Link to="/" className="hidden sm:block text-gray-500 font-bold hover:text-blue-600 transition-colors">Browse</Link>

                {user ? (
                    <div className="flex items-center gap-4 bg-gray-50 pl-4 pr-2 py-1.5 rounded-2xl border border-gray-100">
                        <div className="flex flex-col items-end border-r pr-4 border-gray-200">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Logged in as</span>
                            <span className="font-bold text-blue-600 text-sm italic">{user.name}</span>
                        </div>

                        {(user.role === 'admin' || user.role === 'organizer') && (
                            <Link to="/admin" className="flex items-center gap-2 text-white bg-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                                <Shield size={14} /> ADMIN
                            </Link>
                        )}

                        <Link to="/dashboard" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Dashboard">
                            <LayoutDashboard size={20} />
                        </Link>

                        <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="flex items-center gap-2 font-bold text-gray-700 hover:text-blue-600 px-4 py-2 transition-colors">
                           <LogIn size={18} /> Login
                        </Link>
                        <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-0.5">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

const Home = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async() => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/events');
                const eventData = Array.isArray(res.data) ? res.data : [];
                setEvents(eventData);
                setFilteredEvents(eventData);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchTerm(query);
        const filtered = events.filter((ev) => 
            (ev.title?.toLowerCase().includes(query)) || 
            (ev.location?.toLowerCase().includes(query))
        );
        setFilteredEvents(filtered);
    };

    return ( 
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-blue-600 text-white py-24 px-4 text-center">
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Discover Amazing Events</h1>
                <div className="max-w-2xl mx-auto relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={24} />
                    <input 
                        type="text"
                        placeholder="Search by event name or location..."
                        className="w-full pl-16 pr-8 py-6 rounded-[2rem] text-gray-900 text-lg shadow-2xl focus:ring-4 focus:ring-blue-300 outline-none transition-all"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-16">
                <h2 className="text-3xl font-black text-gray-900 mb-10">Upcoming Events</h2>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[1, 2, 3].map(n => <div key={n} className="h-80 bg-gray-200 rounded-[2.5rem] animate-pulse"></div>)}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredEvents.map((ev) => <EventCard key={ev.id} event={ev} />)}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                        <p className="text-2xl font-bold text-gray-300">Oops! No events found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try {
                setUser(JSON.parse(saved));
            } catch (e) {
                localStorage.removeItem("user");
            }
        }
    }, []);

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar user={user} setUser={setUser} />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/event/:id" element={<EventDetails />} />
                        <Route path="/login" element={
                            <Login onLogin={(u) => {
                                setUser(u);
                                localStorage.setItem("user", JSON.stringify(u));
                            }} />
                        } />
                        <Route path="/register" element={<Register />} />
                        
                        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/admin" element={
                            user && (user.role === 'admin' || user.role === 'organizer') 
                            ? <AdminPanel /> 
                            : <Navigate to="/dashboard" />
                        } />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;