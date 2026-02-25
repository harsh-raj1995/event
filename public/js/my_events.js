console.log("MY EVENTS JS RUNNING");

const container = document.getElementById("myEventsContainer");

async function loadMyEvents() {
    try {
        const res = await fetch("/my-events/Harsh Raj");
        const events = await res.json();

        console.log("Fetched events:", events);

        container.innerHTML = "";

        events.forEach(event => {

            const card = document.createElement("div");
            card.classList.add("event-card");

            card.innerHTML = `
                <h3>${event.title}</h3>
                <p>${event.category}</p>
                <p>${event.location} • ${event.date}</p>

                <div class="card-footer">
                    <button class="btn-primary manage-btn">
                        Manage
                    </button>
                </div>
            `;

            const manageBtn = card.querySelector(".manage-btn");

            console.log("Button found:", manageBtn);

            manageBtn.addEventListener("click", () => {
                console.log("CLICK WORKING");
                window.location.href = `/html/manage_event.html?id=${event.id}`;
            });

            container.appendChild(card);
        });

    } catch (err) {
        console.error("ERROR:", err);
    }
}

loadMyEvents();