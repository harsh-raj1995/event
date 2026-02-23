const container = document.getElementById("myEventsContainer");

async function loadMyEvents() {
    const res = await fetch("/my-events/Harsh Raj");
    const events = await res.json();

    container.innerHTML = "";

    if (events.length === 0) {
        container.innerHTML = "<p>No events created yet.</p>";
        return;
    }

    events.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div style="padding:20px;">
                <h3>${event.title}</h3>
                <p>${event.category}</p>
                <span>${event.location} • ${event.date}</span>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `manage_event.html?id=${event.id}`;
        });

        container.appendChild(card);
    });
}

loadMyEvents();