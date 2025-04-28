document.addEventListener("DOMContentLoaded", async () => {
    const category = document.body.getAttribute("data-category"); // Get category from HTML
    if (!category) return; // Exit if category is not defined
  
    const eventsContainer = document.getElementById("event-list"); // The div where events will be displayed
    if (!eventsContainer) return;
  
    const db = firebase.firestore(); // Initialize Firestore
    const eventsRef = db.collection("events").doc(category).collection("allEvents");
  
    try {
        const snapshot = await eventsRef.get();
        eventsContainer.innerHTML = ""; // Clear previous content
  
        snapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");
            eventCard.innerHTML = `
                <h3>${eventData.name}</h3>
                <a href="#" class="event-button" data-id="${doc.id}">View Event</a>
            `;
            eventsContainer.appendChild(eventCard);
        });
  
        // Add event listeners to "View Event" links
        document.querySelectorAll(".event-button").forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                const eventId = this.getAttribute("data-id");
                const event = snapshot.docs.find(doc => doc.id === eventId).data();
                showModal(event);
            });
        });
  
    } catch (error) {
        console.error("Error fetching events:", error);
    }
  });
  
  // Function to show modal with event details
  function showModal(event) {
    const modal = document.getElementById("eventModal");
    document.getElementById("modal-event-name").innerText = event.name;
    document.getElementById("modal-event-description").innerText = event.description;
    document.getElementById("modal-event-type").innerText = event.type;
    document.getElementById("modal-event-coordinator").innerText = event.coordinator;
    document.getElementById("modal-event-prize").innerText = event.prize;
    document.getElementById("modal-event-rules").innerText = event.rules;
    modal.style.display = "block";
  
    // Close modal when clicking on the close button
    document.querySelector(".close").onclick = function () {
        modal.style.display = "none";
    };
  
    // Close modal when clicking outside of the modal content
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
  }