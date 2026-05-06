const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config(); // Sabse upar hona chahiye

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- 1. RAZORPAY SETUP (Using .env) ---
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- 2. MYSQL DATABASE CONNECTION (Using .env) ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, conn) => {
    if (err) console.error("❌ MySQL Connection Failed:", err.message);
    else {
        console.log("✅ MySQL Database Connected Successfully!");
        conn.release();
    }
});

// --- 3. ROUTES ---

app.get('/', (req, res) => {
    res.send("Event Booking API is running with MySQL...");
});

// Razorpay Order Creation Route
app.post("/api/payment/checkout", async(req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
});

// Get All Events from MySQL
app.get('/api/events', (req, res) => {
    const sql = "SELECT * FROM events ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "DB Error", error: err.message });
        res.status(200).json(results);
    });
});

// Get Single Event by ID from MySQL
app.get('/api/events/:id', (req, res) => {
    const sql = "SELECT * FROM events WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: "DB Error", error: err.message });
        if (results.length > 0) res.status(200).json(results[0]);
        else res.status(404).json({ message: "Event not found" });
    });
});

// Booking Route
app.post('/api/bookings', (req, res) => {
    const { user_id, event_id, event_title, ticket_id, tickets, total_price, payment_id } = req.body;
    const sql = `INSERT INTO bookings (user_id, event_id, event_title, ticket_id, tickets, total_price, payment_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [user_id, event_id, event_title, ticket_id, tickets, total_price, payment_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        // Update available seats
        db.query("UPDATE events SET available_seats = available_seats - ? WHERE id = ?", [tickets, event_id], (updErr) => {
            if (updErr) console.error("Seat Update Error:", updErr);
            res.json({ success: true, message: "Booking Confirmed!" });
        });
    });
});

// --- Port Setup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});