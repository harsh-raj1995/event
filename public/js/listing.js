const container = document.getElementById("eventsContainer");

async function loadEvents() {
    const res = await fetch("/events");
    const events = await res.json();

    container.innerHTML = "";

    events.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div style="padding: 20px;">
                <h3>${event.title}</h3>
                <p>${event.category}</p>
                <span>${event.location} • ${event.date}</span>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `event_detail.html?id=${event.id}`;
        });

        container.appendChild(card);
    });
}

loadEvents();