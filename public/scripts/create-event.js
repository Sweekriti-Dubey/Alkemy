document.addEventListener("DOMContentLoaded", function () {
  const eventForm = document.getElementById("event-form");
  
  if (!eventForm) {
    console.error("❌ Event form not found! Check if the ID is correct.");
    return;
  }

  eventForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const name = document.getElementById("event-name").value;
    const type = document.getElementById("event-type").value;
    const coordinator = document.getElementById("coordinator").value;
    const prize = document.getElementById("prize").value;
    const description = document.getElementById("description").value;
    const rules = document.getElementById("rules").value;
    const category = document.getElementById("category").value; // Get selected category
    
    if (!name || !type || !coordinator || !prize || !description || !rules || !category) {
        alert("Please fill in all fields");
        return;
    }
    
    try {
        const db = firebase.firestore();
        
        // Save event data to Firestore
        await db.collection("events").doc(category).collection("allEvents").add({
            name,
            type,
            coordinator,
            prize,
            description,
            rules,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        alert("Event added successfully!");
        eventForm.reset();
    } catch (error) {
        console.error("Error adding event: ", error);
        alert("Failed to add event. Try again.");
    }
  });
});