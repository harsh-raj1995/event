console.log("MY EVENTS JS RUNNING");

document.addEventListener('DOMContentLoaded', function () {

    const calendarEl = document.getElementById('calendar');
    const filterCategory = document.getElementById("filterCategory");
    const filterType = document.getElementById("filterType");
    const filterTime = document.getElementById("filterTime");

    const modal = document.getElementById("eventModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDetails = document.getElementById("modalDetails");
    const closeModal = document.getElementById("closeModal");
    const manageBtn = document.getElementById("manageBtn");

    let allEvents = [];

    async function loadEvents() {
        const res = await fetch("/my-events/Harsh Raj");
        const events = await res.json();

        allEvents = events.map(event => {

            let today = new Date();
            let eventDate = new Date(event.date);

            let color = "#007bff"; // registered default

            if (event.createdBy === "Harsh Raj") {
                color = "#28a745"; // green
            }

            if (eventDate < today) {
                color = "#dc3545"; // red
            }

            if (eventDate.toDateString() === today.toDateString()) {
                color = "#ff8c42"; // orange
            }

            return {
                id: event.id,
                title: event.title,
                start: event.date,
                color: color,
                extendedProps: {
                    category: event.category,
                    location: event.location,
                    organizer: event.createdBy,
                    status: event.createdBy === "Harsh Raj" ? "Created" : "Registered"
                }
            };
        });

        calendar.addEventSource(allEvents);
        updateDashboardCounts();
        startReminderCheck();
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [],
        eventClick: function(info) {

            const e = info.event;

            modalTitle.innerText = e.title;
            modalDetails.innerText =
                "Date: " + e.start.toLocaleString() +
                "\nCategory: " + e.extendedProps.category +
                "\nLocation: " + e.extendedProps.location +
                "\nOrganizer: " + e.extendedProps.organizer +
                "\nStatus: " + e.extendedProps.status;

            manageBtn.onclick = () => {
                window.location.href = `/html/manage_event.html?id=${e.id}`;
            };

            modal.classList.remove("hidden");
        }
    });

    calendar.render();
    loadEvents();

    closeModal.onclick = () => modal.classList.add("hidden");

    /* FILTER LOGIC */
    [filterCategory, filterType, filterTime].forEach(filter =>
        filter.addEventListener("change", applyFilters)
    );

    function applyFilters() {
        calendar.removeAllEvents();

        let filtered = allEvents.filter(e => {

            let matchCategory = !filterCategory.value || e.extendedProps.category === filterCategory.value;
            let matchType = !filterType.value || e.extendedProps.status.toLowerCase() === filterType.value;

            let now = new Date();
            let eventDate = new Date(e.start);

            let matchTime = true;
            if (filterTime.value === "upcoming") matchTime = eventDate >= now;
            if (filterTime.value === "past") matchTime = eventDate < now;

            return matchCategory && matchType && matchTime;
        });

        calendar.addEventSource(filtered);
    }

    /* Dashboard Sync */
    function updateDashboardCounts() {
        const upcoming = allEvents.filter(e => new Date(e.start) >= new Date()).length;
        const total = allEvents.length;
        const registered = allEvents.filter(e => e.extendedProps.status === "Registered").length;

        console.log("Total:", total);
        console.log("Upcoming:", upcoming);
        console.log("Registered:", registered);
    }

    /* Reminder System */
    function startReminderCheck() {
        setInterval(() => {
            let now = new Date();

            allEvents.forEach(e => {
                let eventTime = new Date(e.start);
                let diff = eventTime - now;

                if (diff > 0 && diff < 3600000) { // 1 hour
                    alert("Reminder: " + e.title + " starts within 1 hour!");
                }
            });

        }, 60000);
    }

});