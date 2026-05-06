import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post('http://localhost:5000/api/login', credentials);
            if (res.data.success || res.data.status === "Success") {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                onLogin(res.data.user);
                const userRole = res.data.user.role;
                if (userRole === 'admin' || userRole === 'organizer') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            setError("Server connection failed. Please try later.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            <div className="w-full max-w-[460px]">
                {/* Brand Identity */}
                <div className="flex items-center gap-3 mb-12 justify-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                        <Calendar className="text-white" size={22} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight transition-all">
                        Event<span className="text-blue-600">Book</span>
                    </span>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-slate-800">Sign in to Account</h2>
                        <p className="text-slate-500 text-sm mt-2">Welcome back! Please enter your details.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <p className="text-red-700 text-xs font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Input Fields */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="email" name="email" placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm text-slate-800 font-medium"
                                    onChange={handleChange} required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="password" name="password" placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm text-slate-800 font-medium"
                                    onChange={handleChange} required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Role</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select 
                                    name="role" value={credentials.role} onChange={handleChange}
                                    className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none cursor-pointer text-sm font-bold text-slate-700 focus:bg-white transition-all"
                                >
                                    <option value="user">User</option>
                                    <option value="organizer"> Organizer</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ArrowRight size={16} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 mt-4 active:scale-[0.98]">
                            Sign In
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        New user? <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;