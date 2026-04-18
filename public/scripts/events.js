document.addEventListener("DOMContentLoaded", function () {
  const eventListContainer = document.getElementById("eventList");
  const category = document.body.getAttribute("data-category");  // Read category from the body tag

  // Debugging: Log the category value and entire body element
  console.log("Category from body:", category);
  console.log("Body element:", document.body);

  if (!category) {
    console.error("Category is not set in data-category attribute!");
    return;
  }

  // Ensure Firebase is loaded
  if (typeof firebase === "undefined") {
    console.error("Firebase SDK not loaded!");
    return;
  }

  const db = firebase.firestore(); // Initialize Firestore

  // Fetch events for the specified category
  async function loadEvents() {
    try {
      const eventsSnapshot = await db.collection("events")
        .doc(category)  // Use the category from the body tag (sports, esports, etc.)
        .collection("allEvents")
        .orderBy("createdAt", "desc")  // Optional: order events by creation date
        .get();

      // Check if events are available
      if (!eventsSnapshot.empty) {
        eventsSnapshot.forEach((doc) => {
          const event = doc.data();
          displayEvent(event);
        });
      } else {
        eventListContainer.innerHTML = "<p>No events available</p>";
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      eventListContainer.innerHTML = "<p>Unable to load events. Please try again later.</p>";
    }
  }

  // Function to display event details
  function displayEvent(event) {
    const eventElement = document.createElement("div");
    eventElement.classList.add("event");

    eventElement.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Type:</strong> ${event.type}</p>
      <p><strong>Coordinator:</strong> ${event.coordinator}</p>
      <p><strong>Prize:</strong> ${event.prize}</p>
      <p><strong>Description:</strong> ${event.description}</p>
      <p><strong>Rules:</strong> ${event.rules}</p>
    `;

    eventListContainer.appendChild(eventElement);
  }

  // Load events when the page is ready
  loadEvents();
});