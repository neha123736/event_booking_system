import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Tickets, X, Plus } from 'lucide-react';

// File name ke mutabik component ka naam BookingSuccessModal rakha hai
const BookingSuccessModal = ({ isOpen, onClose, details }) => {
    const navigate = useNavigate();

    if (!isOpen || !details) return null;

    return ( <
        div className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" >
        <
        div className = "bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 space-y-8 relative" >

        { /* Close Button */ } <
        button onClick = { onClose }
        className = "absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors" >
        <
        X size = { 24 }
        /> < /
        button >

        { /* Header */ } <
        div className = "flex items-center gap-5 border-b border-gray-100 pb-8" >
        <
        div className = "bg-emerald-50 p-3 rounded-2xl" >
        <
        CheckCircle2 size = { 36 }
        className = "text-emerald-500" / >
        <
        /div> <
        div >
        <
        h2 className = "text-2xl font-black text-emerald-600 tracking-tight" > Booking Confirmed! < /h2> <
        p className = "text-gray-500 text-sm font-medium" > Your tickets have been successfully booked. < /p> < /
        div > <
        /div>

        { /* Ticket Details Box */ } <
        div className = "bg-gray-50/80 rounded-[2rem] p-7 border border-gray-100 space-y-5" >
        <
        div className = "flex justify-between items-center text-sm" >
        <
        span className = "font-bold text-gray-400 uppercase tracking-widest text-[10px]" > Event < /span> <
        span className = "font-black text-gray-800" > { details.eventName || details.event_title } < /span> < /
        div >

        <
        div className = "flex justify-between items-center text-sm" >
        <
        span className = "font-bold text-gray-400 uppercase tracking-widest text-[10px]" > Ticket ID < /span> <
        span className = "font-mono font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50" > { details.ticketId || details.id } <
        /span> < /
        div >

        <
        div className = "flex justify-between items-center text-sm" >
        <
        span className = "font-bold text-gray-400 uppercase tracking-widest text-[10px]" > Tickets < /span> <
        span className = "font-black text-gray-800" > { details.ticketsBooked || details.quantity }
        Tickets < /span> < /
        div >

        <
        div className = "pt-4 border-t border-dashed border-gray-200 flex justify-between items-center" >
        <
        span className = "text-gray-900 font-black" > Total Paid < /span> <
        span className = "text-2xl font-black text-gray-900" > ₹{ details.totalPaid || details.total_price } < /span> < /
        div > <
        /div>

        { /* Action Buttons */ } <
        div className = "grid grid-cols-2 gap-4" >
        <
        button onClick = {
            () => {
                onClose();
                navigate('/admin');
            }
        } // Aapke route ke hisaab se
        className = "flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-xl active:scale-95" >
        <
        Tickets size = { 18 }
        />
        View Bookings <
        /button>

        <
        button onClick = {
            () => {
                onClose();
                navigate('/addevent');
            }
        }
        className = "flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 py-4 rounded-2xl font-bold text-sm hover:bg-gray-900 hover:text-white transition-all active:scale-95" >
        <
        Plus size = { 18 }
        />
        Add Event <
        /button> < /
        div > <
        /div> < /
        div >
    );
};

export default BookingSuccessModal;