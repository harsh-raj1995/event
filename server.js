// ================= BASIC SERVER SETUP =================
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// ================= FILE PATHS =================
const eventsPath = path.join(__dirname, "data", "events.json");
const participantsPath = path.join(__dirname, "data", "participants.json");
const notificationsPath = path.join(__dirname, "data", "notifications.json");
const usersPath = path.join(__dirname, "data", "users.json");

// ================= HELPER FUNCTIONS =================
function readData(filePath) {
    return JSON.parse(fs.readFileSync(filePath));
}

function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// =====================================================
// ================= EVENTS ROUTES =====================
// =====================================================

// ✅ 1️⃣ Get ALL events (All Events page)
app.get("/events", (req, res) => {
    const events = readData(eventsPath);
    res.json(events);
});

// ✅ 2️⃣ Get ONE event by ID
app.get("/events/:id", (req, res) => {
    const events = readData(eventsPath);
    const event = events.find(e => e.id == req.params.id);
    res.json(event);
});

// ✅ 3️⃣ Create new event
app.post("/events", (req, res) => {
    const events = readData(eventsPath);

    const newEvent = {
        id: Date.now(),
        title: req.body.title,
        category: req.body.category,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        createdById: req.body.createdById   // 🔥 userId mapping
    };

    events.push(newEvent);
    writeData(eventsPath, events);

    res.json(newEvent);
});

// =====================================================
// ================= MY EVENTS ROUTE ===================
// =====================================================

app.get("/my-events/:userId", (req, res) => {

    const events = readData(eventsPath);
    const users = readData(usersPath);

    const userId = req.params.userId;
    const user = users.find(u => u.id == userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // 👑 Admin sees all events
    if (user.role === "admin") {
        return res.json(events);
    }

    // 👤 Normal user sees only their events
    const userEvents = events.filter(
        e => e.createdById == userId
    );

    res.json(userEvents);
});

// =====================================================
// ================= DASHBOARD ROUTE ===================
// =====================================================

app.get("/dashboard/:userId", (req, res) => {

    const events = readData(eventsPath);
    const participants = readData(participantsPath);
    const notifications = readData(notificationsPath);
    const users = readData(usersPath);

    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    let userEvents;

    if (user.role === "admin") {
        userEvents = events;
    } else {
        // 🔥 Match events using email (since events store createdBy as email)
        userEvents = events.filter(
            e => e.createdBy === user.email
        );
    }

    // Get event IDs created by user
    const userEventIds = userEvents.map(e => e.id);

    // Count participants in user's events
    const totalParticipants = participants.filter(p =>
        userEventIds.includes(Number(p.eventId))
    ).length;

    // 🔥 Count notifications only for user's events
    const totalAnnouncements = notifications.filter(n =>
        userEventIds.includes(Number(n.eventId))
    ).length;

    res.json({
        totalEvents: userEvents.length,
        totalParticipants,
        totalAnnouncements
    });
});
// =====================================================
// ================= PARTICIPANTS ======================
// =====================================================

// Get participants of a specific event
app.get("/participants/:eventId", (req, res) => {
    const participants = readData(participantsPath);
    const filtered = participants.filter(
        p => p.eventId == req.params.eventId
    );
    res.json(filtered);
});

// Add participant
app.post("/participants", (req, res) => {
    const participants = readData(participantsPath);

    const newParticipant = {
        id: Date.now(),
        eventId: req.body.eventId,
        name: req.body.name,
        email: req.body.email
    };

    participants.push(newParticipant);
    writeData(participantsPath, participants);

    res.json(newParticipant);
});

// Delete participant
app.delete("/participants/:id", (req, res) => {
    let participants = readData(participantsPath);

    participants = participants.filter(
        p => p.id != req.params.id
    );

    writeData(participantsPath, participants);

    res.json({ message: "Participant removed" });
});

// =====================================================
// ================= NOTIFICATIONS =====================
// =====================================================

app.post("/notifications", (req, res) => {

    const notifications = readData(notificationsPath);

    const newNotification = {
        id: Date.now(),
        eventId: req.body.eventId,
        message: req.body.message,
        date: new Date().toISOString()
    };

    notifications.push(newNotification);
    writeData(notificationsPath, notifications);

    res.json(newNotification);
});

app.get("/notifications", (req, res) => {
    const notifications = readData(notificationsPath);
    res.json(notifications);
});

// =====================================================
// ================= LOGIN ROUTE =======================
// =====================================================

app.post("/login", (req, res) => {
    const users = readData(usersPath);
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.json({ status: "invalid" });
    }

    if (user.password === password) {
        return res.json({
            status: "success",
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } else {
        return res.json({ status: "invalid" });
    }
});

