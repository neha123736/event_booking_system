import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, Minus, Plus } from "lucide-react";
import BookingConfirmationModal from "./BookingSuccessModal";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticketCount, setTicketCount] = useState(1);
    const [bookingDetails, setBookingDetails] = useState(null);

    // --- Razorpay Script Loading ---
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchEvent = async() => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/events/${id}`);
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setEvent(data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchEvent();
    }, [id]);

    const incrementTickets = () => setTicketCount((prev) => prev + 1);
    const decrementTickets = () => setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));

    const handlePayment = async() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id || user.userId || user._id;

        if (!userId) {
            alert("Please login to book tickets!");
            return navigate("/login");
        }

        if (!window.Razorpay) {
            alert("Razorpay loading... please wait.");
            return;
        }

        const unitPrice = parseFloat(String(event.price).replace(/[^0-9.]/g, "")) || 0;
        const totalAmount = unitPrice * ticketCount;

        try {
            const orderRes = await axios.post("http://localhost:5000/api/payment/checkout", {
                amount: totalAmount,
            });

          //  const orderData = orderRes.data.order;
const orderData = orderRes.data.order || orderRes.data;
            const options = {
                // FIXED: Updated to your new working Key ID
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_SldL819vd0BntL",
                amount: orderData.amount,
                currency: "INR",
                name: "EventBook",
                description: `Booking for ${event.title}`,
                order_id: orderData.id,
                handler: async function(response) {
                    completeBooking(totalAmount, response.razorpay_payment_id);
                },
                prefill: {
                    name: user.name || "",
                    email: user.email || "",
                },
                theme: { color: "#2563eb" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment Error:", err);
            alert("Payment initialization failed. Check backend connection.");
        }
    };

    const completeBooking = async(totalAmount, paymentId) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id || user.userId || user._id;
        const tktId = "TKT-" + Math.floor(100000 + Math.random() * 900000);

        const bookingData = {
            user_id: userId,
            event_id: id,
            event_title: event.title,
            ticket_id: tktId,
            tickets: ticketCount,
            total_price: totalAmount,
            payment_id: paymentId,
        };

        try {
            const res = await axios.post("http://localhost:5000/api/bookings", bookingData);
            if (res.data.success) {
                setBookingDetails({
                    eventName: event.title,
                    ticketId: tktId,
                    ticketsBooked: ticketCount,
                    totalPaid: totalAmount,
                });
                setIsModalOpen(true);
            }
        } catch (err) {
            console.error("Booking Error:", err);
            alert("Booking failed after payment. Check console for details.");
        }
    };

    if (loading) return <div className = "text-center py-20 font-bold" > Loading... < /div>;
    if (!event) return <div className = "text-center py-20 font-bold" > Event not found! < /div>;

    const userObj = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = userObj.name || "User";

    return ( <
        div className = "bg-[#f9fafb] min-h-screen font-sans" >
        <
        header className = "bg-white border-b border-gray-100 sticky top-0 z-10" >
        <
        div className = "max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" >
        <
        div className = "flex items-center gap-2 text-blue-600 font-bold text-xl cursor-pointer"
        onClick = {
            () => navigate("/")
        } >
        <
        Calendar size = { 24 }
        /> <span>EventBook</span >
        <
        /div>  <
        div className = "flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100" >
        <
        div className = "w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs" > { userName.charAt(0).toUpperCase() } <
        /div>  <
        span className = "text-sm font-semibold text-gray-700" > { userName } < /span>  < /
        div > <
        /div>  < /
        header >

        <
        main className = "max-w-6xl mx-auto px-6 py-10" >
        <
        div className = "grid grid-cols-1 lg:grid-cols-3 gap-10" >
        <
        div className = "lg:col-span-2 space-y-8" >
        <
        div className = "bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm" >
        <
        img src = { event.image_url }
        className = "w-full h-[400px] object-cover"
        alt = { event.title }
        />  <
        div className = "p-10" >
        <
        h1 className = "text-4xl font-extrabold text-gray-900 mb-8 tracking-tight" > { event.title } < /h1>  <
        div className = "grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-6 mb-10" >
        <
        div className = "flex items-center gap-4" >
        <
        div className = "p-3 bg-blue-50 text-blue-600 rounded-xl" > < Calendar size = { 22 }
        /></div >
        <
        div >
        <
        p className = "text-[10px] font-bold text-gray-400 uppercase tracking-widest" > Date & Time < /p>  <
        p className = "text-[15px] font-bold text-gray-800" > { event.date_time } < /p>  < /
        div > <
        /div>  <
        div className = "flex items-center gap-4" >
        <
        div className = "p-3 bg-blue-50 text-blue-600 rounded-xl" > < MapPin size = { 22 }
        /></div >
        <
        div >
        <
        p className = "text-[10px] font-bold text-gray-400 uppercase tracking-widest" > Location < /p>  <
        p className = "text-[15px] font-bold text-gray-800" > { event.location } < /p>  < /
        div > <
        /div>  < /
        div > <
        div className = "border-t border-gray-100 pt-10 text-gray-500" >
        <
        h3 className = "text-xl font-bold text-gray-900 mb-4" > About This Event < /h3>  <
        p > { event.description } < /p>  < /
        div > <
        /div>  < /
        div > <
        /div>

        <
        aside className = "lg:col-span-1" >
        <
        div className = "sticky top-24 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm" >
        <
        h3 className = "font-bold text-lg text-gray-800 mb-6" > Book Your Tickets < /h3>  <
        div className = "flex items-baseline gap-1 mb-8" >
        <
        span className = "text-4xl font-extrabold text-blue-600" > ₹{ event.price } < /span>  <
        span className = "text-gray-400 text-sm font-semibold tracking-wide" > per ticket < /span>  < /
        div > <
        div className = "space-y-6 mb-8" >
        <
        div className = "flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-2" >
        <
        button onClick = { decrementTickets }
        className = "p-2" > < Minus size = { 20 }
        /></button >
        <
        span className = "text-xl font-bold" > { ticketCount } < /span>  <
        button onClick = { incrementTickets }
        className = "p-2" > < Plus size = { 20 }
        /></button >
        <
        /div>  <
        div className = "flex justify-between items-center pt-3 border-t border-gray-100" >
        <
        span className = "font-bold text-gray-900" > Total Amount < /span>  <
        span className = "text-2xl font-black text-blue-600" > ₹{ parseFloat(String(event.price).replace(/[^0-9.]/g, "")) * ticketCount } < /span>  < /
        div > <
        /div>  <
        button onClick = { handlePayment }
        className = "w-full py-4 bg-[#0a0c10] text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all" >
        Book Now <
        /button>  < /
        div > <
        /aside>  < /
        div > <
        /main>

        <
        BookingConfirmationModal isOpen = { isModalOpen }
        onClose = {
            () => setIsModalOpen(false)
        }
        details = { bookingDetails }
        />  < /
        div >
    );
};

export default EventDetails;