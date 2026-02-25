
//basic server.js setup
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

//helper function
const eventsPath = path.join(__dirname, "data", "events.json");
const participantsPath = path.join(__dirname, "data", "participants.json");
const notificationsPath = path.join(__dirname, "data", "notifications.json");

/* ================= LOGIN USERS PATH ================= */
const usersPath = path.join(__dirname, "data", "users.json");

function readData(filePath) {
    return JSON.parse(fs.readFileSync(filePath));
}

function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

//get all events
app.get("/events", (req, res) => {
    const events = readData(eventsPath);
    res.json(events);
});

//get one event specific
app.get("/events/:id", (req, res) => {
    const events = readData(eventsPath);
    const event = events.find(e => e.id == req.params.id);
    res.json(event);
});

//create event
app.post("/events", (req, res) => {
    const events = readData(eventsPath);

    const newEvent = {
        id: Date.now(),
        title: req.body.title,
        category: req.body.category,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        createdBy: req.body.createdBy
    };

    events.push(newEvent);
    writeData(eventsPath, events);

    res.json(newEvent);
});

app.get("/my-events/:user", (req, res) => {
    const events = readData(eventsPath);
    const userEvents = events.filter(e => e.createdBy == req.params.user);
    res.json(userEvents);
});

//get participants of event
app.get("/participants/:eventId", (req, res) => {
    const participants = readData(participantsPath);
    const filtered = participants.filter(p => p.eventId == req.params.eventId);
    res.json(filtered);
});

//add participants
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

//delete participants
app.delete("/participants/:id", (req, res) => {
    let participants = readData(participantsPath);

    participants = participants.filter(p => p.id != req.params.id);

    writeData(participantsPath, participants);

    res.json({ message: "Participant removed" });
});

//dashboard route
app.get("/dashboard/:user", (req, res) => {
    const events = readData(eventsPath);
    const participants = readData(participantsPath);

    const userEvents = events.filter(e => e.createdBy == req.params.user);

    const totalParticipants = participants.filter(p =>
        userEvents.some(e => e.id == p.eventId)
    ).length;

    res.json({
        totalEvents: userEvents.length,
        totalParticipants
    });
});

app.post("/notifications", (req, res) => {
    console.log("POST /notifications hit");
    console.log(req.body);

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
app.get("/calender", (req, res) => {
    res.sendFile(__dirname + "/public/calender.html");
});


/* ================= LOGIN ROUTE ================= */
app.post("/login", (req, res) => {
    const users = readData(usersPath);
    const { email, password } = req.body;

    const user = users.find(u =>
        u.email === email && u.password === password
    );

    if (user) {
        res.json({
            status: "success",
            name: user.name,
            email: user.email
        });
    } else {
        res.json({ status: "invalid" });
    }
});
