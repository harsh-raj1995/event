document.addEventListener("DOMContentLoaded", () => {

    // Temporary fallback values until backend loads
    document.getElementById("totalEvents").textContent = "0";
    document.getElementById("totalParticipants").textContent = "0";
    document.getElementById("totalAnnouncements").textContent = "0";

});


async function loadDashboard() {

    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    // Dashboard stats
    const dashRes = await fetch(`/dashboard/${userEmail}`);
    const dashData = await dashRes.json();

    document.getElementById("totalEvents").textContent =
        dashData.totalEvents;

    document.getElementById("totalParticipants").textContent =
        dashData.totalParticipants;

    // Notifications count
    const notifRes = await fetch("/notifications");
    const notifications = await notifRes.json();

    document.getElementById("totalAnnouncements").textContent =
        notifications.length;
}

async function loadDashboardExtras() {

    const eventsRes = await fetch("/events");
    const events = await eventsRes.json();

    const participantsRes = await fetch("/participants");
    const participants = await participantsRes.json();

    const announcementsRes = await fetch("/notifications");
    const announcements = await announcementsRes.json();

    // RECENT EVENTS
    const recentEvents = document.getElementById("recentEvents");
    recentEvents.innerHTML = "";

    events.slice(-3).reverse().forEach(e => {
        recentEvents.innerHTML += `
            <div class="small-item">
                ${e.title} • ${e.date}
            </div>
        `;
    });

    // UPCOMING EVENTS
    const upcoming = document.getElementById("upcomingEvents");
    upcoming.innerHTML = "";

    const today = new Date();

    events.filter(e => new Date(e.date) > today)
        .slice(0,3)
        .forEach(e => {
            upcoming.innerHTML += `
                <div class="small-item">
                    ${e.title} • ${e.date}
                </div>
            `;
        });

    // RECENT PARTICIPANTS
    const recentParticipants = document.getElementById("recentParticipants");
    recentParticipants.innerHTML = "";

    participants.slice(-5).reverse().forEach(p => {
        recentParticipants.innerHTML += `
            <div class="small-item">
                ${p.name} → ${p.eventTitle}
            </div>
        `;
    });

    // RECENT ANNOUNCEMENTS
    const recentAnnouncements = document.getElementById("recentAnnouncements");
    recentAnnouncements.innerHTML = "";

    announcements.slice(-3).reverse().forEach(a => {
        recentAnnouncements.innerHTML += `
            <div class="small-item">
                ${a.message}
            </div>
        `;
    });
}

loadDashboardExtras();
loadDashboard();