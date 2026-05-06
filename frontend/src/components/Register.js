import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post('http://localhost:5000/api/register', formData);

            if (res.data && (res.data.success === true || res.data.status === "Success")) {
                alert("Registration Successful! Now Login.");
                navigate('/login');
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (err) {
            let errorMsg = "Server error or connection failed.";
            if (err.response?.data?.error) errorMsg = err.response.data.error;
            else if (err.response?.data?.message) errorMsg = err.response.data.message;

            setError(errorMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">

            {/* Card */}
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100">

                {/* Title */}
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    Join EventBook and explore amazing events
                </p>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-center text-sm border border-red-100">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <select
                        className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-blue-600  text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg"
                    >
                        Create Account
                    </button>
                </form>

                {/* Login link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?
                    <Link to="/login" className="text-blue-600 font-bold ml-1 hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;