async function loadDashboard() {
    const user = "Harsh Raj";

    // Get dashboard stats
    const dashRes = await fetch(`/dashboard/${user}`);
    const dashData = await dashRes.json();

    document.getElementById("totalEvents").textContent =
        dashData.totalEvents;

    document.getElementById("totalParticipants").textContent =
        dashData.totalParticipants;

    // Get notifications count
    const notifRes = await fetch("/notifications");
    const notifications = await notifRes.json();

    document.getElementById("totalAnnouncements").textContent =
        notifications.length;
}

loadDashboard();