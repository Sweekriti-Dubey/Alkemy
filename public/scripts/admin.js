document.addEventListener("DOMContentLoaded", function () {
  const createEventForm = document.getElementById("createEventForm");
  const eventsList = document.getElementById("eventsList");
  const exportButton = document.getElementById("exportButton");

  // Create Event
  createEventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const eventName = document.getElementById("eventName").value;
    const eventDescription = document.getElementById("eventDescription").value;
    const eventDate = document.getElementById("eventDate").value;

    try {
      await firebase.firestore().collection("events").add({
        name: eventName,
        description: eventDescription,
        date: eventDate,
      });

      alert("Event created successfully!");
      createEventForm.reset();
      loadEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  });

  // Load Events
  async function loadEvents() {
    eventsList.innerHTML = "";
    try {
      const querySnapshot = await firebase.firestore().collection("events").get();
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        const eventItem = document.createElement("div");
        eventItem.textContent = `${event.name} - ${event.description} - ${event.date}`;
        eventsList.appendChild(eventItem);
      });
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }

  // Export Data to Excel
  exportButton.addEventListener("click", async () => {
    try {
      const querySnapshot = await firebase.firestore().collection("registrations").get();
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
      XLSX.writeFile(workbook, "registrations.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  });

  // Initial load of events
  loadEvents();
});