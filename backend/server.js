require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const Razorpay = require('razorpay');

const app = express();

// --- 1. CORS CONFIGURATION ---
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());

// --- 2. RAZORPAY INSTANCE ---
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- 3. DATABASE CONNECTION ---
const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'event_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, conn) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
    } else {
        console.log("✅ MySQL Database Connected Successfully!");
        conn.release();
    }
});


// --- 4. PAYMENT CHECKOUT ---
app.post("/api/payment/checkout", async(req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ success: false, message: "Valid Amount is required" });
        }
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("❌ RAZORPAY ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 5. AUTH ROUTES ---
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, password, role || 'user'], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "User registered successfully!" });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?";
    db.query(sql, [email, password, role], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (results.length > 0) res.json({ success: true, user: results[0] });
        else res.status(401).json({ success: false, message: "Invalid credentials" });
    });
});

// --- 6. EVENT ROUTES ---
app.get('/api/events', (req, res) => {
    db.query("SELECT * FROM events ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(results);
    });
});

app.get('/api/events/:id', (req, res) => {
    db.query("SELECT * FROM events WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (results.length > 0) res.json(results[0]);
        else res.status(404).json({ success: false, message: "Event not found" });
    });
});
// --- CREATE EVENT (ADMIN / ORGANIZER) ---
app.post('/api/events', (req, res) => {
    const {
        title,
        description,
        date_time,
        location,
        price,
        category,
        image_url,
        available_seats,
        organizer_id
    } = req.body;

    const sql = `
        INSERT INTO events 
        (title, description, date_time, location, price, category, image_url, available_seats, organizer_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            description,
            date_time,
            location,
            price,
            category,
            image_url,
            available_seats || 50,
            organizer_id || null
        ],
        (err, result) => {
            if (err) {
                console.error("❌ Insert Error:", err);
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Event created successfully",
                eventId: result.insertId
            });
        }
    );
});
// --- 7. BOOKING ROUTES ---
app.post('/api/bookings', (req, res) => {
    const { user_id, event_id, event_title, ticket_id, tickets, total_price } = req.body;
    const payment_id = req.body.payment_id || req.body.razorpay_payment_id || null;

    db.query("SELECT available_seats FROM events WHERE id = ?", [event_id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ success: false, message: "Event not found" });
        if (results[0].available_seats < tickets) {
            return res.status(400).json({ success: false, message: "Not enough seats available!" });
        }
        const sqlBooking = `INSERT INTO bookings (user_id, event_id, event_title, ticket_id, tickets, total_price, payment_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sqlBooking, [user_id, event_id, event_title, ticket_id, tickets, total_price, payment_id], (err) => {
            if (err) return res.status(500).json({ success: false, message: "Booking failed: " + err.message });
            const sqlUpdateSeats = "UPDATE events SET available_seats = available_seats - ? WHERE id = ?";
            db.query(sqlUpdateSeats, [tickets, event_id], (updErr) => {
                if (updErr) console.error("❌ Seat update error:", updErr);
                res.json({ success: true, message: "Booking Confirmed!", payment_id });
            });
        });
    });
});

app.get('/api/my-bookings/:userId', (req, res) => {
    db.query("SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC", [req.params.userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// --- 8. DELETE BOOKING ROUTE ---
// Ye route Dashboard aur Admin dono ke liye kaam karega
app.delete('/api/bookings/:id', (req, res) => {
    const bookingId = req.params.id;

    const sqlDelete = "DELETE FROM bookings WHERE id = ?";

    db.query(sqlDelete, [bookingId], (err, result) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({
                success: false,
                message: "Database error occurred"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        });
    });
});



// --- DELETE EVENT (ADMIN) ---
app.delete('/api/events/:id', (req, res) => {
    const eventId = req.params.id;

    const sql = "DELETE FROM events WHERE id = ?";

    db.query(sql, [eventId], (err, result) => {
        if (err) {
            console.error("❌ Delete Error:", err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.json({
            success: true,
            message: "Event deleted successfully"
        });
    });
});
// --- 9. ADMIN ROUTES ---

app.get('/api/admin/users', (req, res) => {
    const sql = "SELECT id, name, email, role FROM users ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(results);
    });
});

app.get('/api/admin/bookings', (req, res) => {
    const sql = "SELECT * FROM bookings ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(results);
    });
});

app.get('/api/admin/stats', (req, res) => {
    const statsQuery = `
        SELECT 
            (SELECT COUNT(*) FROM events) as events,
            (SELECT COUNT(*) FROM bookings) as bookings,
            (SELECT COUNT(*) FROM users) as users,
            (SELECT IFNULL(SUM(total_price), 0) FROM bookings) as revenue
    `;
    db.query(statsQuery, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(results[0]);
    });
});

// --- 10. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});