document.addEventListener("DOMContentLoaded", async function () {
  const downloadExcelButton = document.getElementById("downloadExcel");

  // Check if the user is an admin
  firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
          const db = firebase.firestore();
          const userDoc = await db.collection("users").doc(user.uid).get();
          if (userDoc.exists && userDoc.data().role === "admin") {
              downloadExcelButton.style.display = "block";
          }
      }
  });

  downloadExcelButton.addEventListener("click", async function () {
      const category = prompt("Enter the category:");
      const eventName = prompt("Enter the event name:");

      if (!category || !eventName) {
          alert("Please provide both category and event name.");
          return;
      }

      try {
          const db = firebase.firestore();
          const registrationsRef = db.collection("registrations").doc(category).collection("allRegistrations");
          const snapshot = await registrationsRef.where("eventName", "==", eventName).get();

          if (snapshot.empty) {
              alert("No registrations found for the selected event.");
              return;
          }

          const registrations = [];
          snapshot.forEach(doc => {
              registrations.push(doc.data());
          });

          const worksheet = XLSX.utils.json_to_sheet(registrations);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

          XLSX.writeFile(workbook, `${eventName}_registrations.xlsx`);
      } catch (error) {
          console.error("Error downloading Excel:", error);
          alert("Failed to download Excel. Please try again.");
      }
  });
});