<<<<<<< HEAD
ONLINE EVENT BOOKING AND MANAGEMENT SYSTEM
Full-Stack Web Development Project Report
In Collaboration with tcsion RIO (Remote Internship Office)

🏛️ PROJECT CREDENTIALS
Institute: Jawaharlal Institute of Technology Vidhya Vihar, Borawan

GitHub Repository: https://github.com/khushbuv870-afk/EventBook-Management-System

1. ACKNOWLEDGEMENTS
I would like to express my sincere gratitude to my faculty members at Jawaharlal Institute of Technology and the mentors at tcsion for providing this internship opportunity. Their technical guidance helped me bridge the gap between academic theory and industry-level full-stack development.

2. OBJECTIVE AND SCOPE
Objective: To design a centralized platform that automates event discovery and seat reservation, ensuring a 24/7 accessible booking experience.

Scope: The system covers secure user authentication, a dynamic event dashboard, and a real-time booking engine with instant Ticket ID generation.

3. PROBLEM STATEMENT
Traditional event management relies on manual entry, which often results in data inconsistency, delayed updates, and the risk of overbooking due to the lack of a real-time seat tracking system.

4. EXISTING APPROACHES
Current manual systems or basic spreadsheets fail to provide instant confirmation to users. High-end platforms like BookMyShow are available but are often too complex for small-scale institutional or local event management.

5. APPROACH / METHODOLOGY
I adopted a MERN/MySQL hybrid approach. I used React for a dynamic frontend, Node.js/Express for backend API logic, and MySQL for structured, relational data management.

6. WORKFLOW
The workflow follows a standard sequence: User Authentication → Event Browsing → Real-time Seat Validation → Database Update → Ticket Generation.

7. ASSUMPTIONS
The server is configured to run on Port 5000 for backend services.

Users have access to a stable internet connection for real-time seat fetching.

The system assumes a single-currency (INR) model for simplicity.

8. IMPLEMENTATION
The project was implemented by building modular components in React and connecting them to RESTful APIs. I used Postman for testing API routes and MySQL for complex query handling.

9. SOLUTION DESIGN
The architecture is divided into three layers:

Presentation Layer: React & Tailwind CSS for a responsive UI.

Logic Layer: Node.js for processing business rules and seat-locking logic.

Data Layer: MySQL for persistent storage of user and event data.

10. CHALLENGES & OPPORTUNITIES
Challenge: Synchronizing the frontend state with the MySQL database during high-traffic booking attempts.

Opportunity: Integrating Razorpay for actual financial transactions in future versions.

11. REFLECTIONS ON THE PROJECT
Working on this tcsion project helped me master the integration of a React frontend with a SQL-based backend. It improved my debugging skills using VS Code and Chrome DevTools.

12. RECOMMENDATIONS
For future deployment, I recommend implementing JWT (JSON Web Tokens) for enhanced session security and using cloud storage (like AWS S3) for event banners and images.

13. OUTCOME / CONCLUSION
The system successfully provides a user-friendly interface that reduces manual labor by 100% and eliminates the possibility of overbooking through automated seat validation.

14. ENHANCEMENT SCOPE
Future updates will include QR Code ticket scanning, automated email confirmations via Nodemailer, and an AI-based recommendation engine for users.

15. LINK TO CODE AND EXECUTABLE FILE

Branch: Main/Master

16. RESEARCH QUESTIONS AND RESPONSES
Q: How is security handled? A: Sensitive credentials like database passwords and Razorpay keys are stored in a .env file.

Q: Why was MySQL chosen? A: Because of its ACID compliance and reliability in handling relational data like event bookings.

17. REFERENCES
tcsion RIO Project Guidelines.

React and Node.js Official Documentation.

MySQL Workbench Reference Manual.
=======
# event_booking_system
Event Booking System built using Node.js, Express, React, and MySQL for managing events, users, and bookings.
>>>>>>> ce3c0604bd12a0d7bdfb93f92155590189e4f098
