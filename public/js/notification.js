const container = document.getElementById("notificationContainer");

async function loadNotifications() {
    const res = await fetch("/notifications");
    const notifications = await res.json();

    container.innerHTML = "";

    if (notifications.length === 0) {
        container.innerHTML = "<p>No notifications yet.</p>";
        return;
    }

    // Show latest first
    notifications.reverse().forEach(notification => {
        const div = document.createElement("div");
        div.classList.add("notification");

        div.innerHTML = `
            <h4>📢 Announcement</h4>
            <p>${notification.message}</p>
            <span class="time">
                ${new Date(notification.date).toLocaleString()}
            </span>
        `;

        container.appendChild(div);
    });
}

loadNotifications();