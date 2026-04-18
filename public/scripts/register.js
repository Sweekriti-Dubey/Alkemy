document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");

  if (!registrationForm) {
      console.error("Registration form not found!");
      return;
  }

  const userRole = localStorage.getItem("userRole");

  // Ensure only 'user' role can access this page
  if (userRole !== "user") {
      alert("You must be a registered user to access the registration form.");
      window.location.href = "index.html"; // Redirect if not a user
      return;
  }

  registrationForm.addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent default form submission

      // Check if input fields exist before accessing them
      const nameField = document.getElementById("name");
      const phoneField = document.getElementById("phoneNumber");
      const emailField = document.getElementById("email");
      const genderField = document.getElementById("gender");
      const paymentField = document.getElementById("payment");

      if (!nameField || !phoneField || !emailField || !genderField || !paymentField) {
          console.error("One or more input fields are missing in the HTML.");
          alert("Error: Some form fields are missing.");
          return;
      }

      // Get values safely
      const name = nameField.value.trim();
      const phoneNumber = phoneField.value.trim();
      const email = emailField.value.trim();
      const gender = genderField.value;
      const payment = paymentField.value;
      const eventId = new URLSearchParams(window.location.search).get("eventId");

      if (!eventId) {
          console.error("Event ID is missing from the URL.");
          alert("Error: Event ID is missing.");
          return;
      }

      try {
          const user = firebase.auth().currentUser;

          await firebase.firestore().collection("registrations").add({
              eventId: eventId,
              userId: user.uid,
              name: name,
              phoneNumber: phoneNumber,
              email: email,
              gender: gender,
              payment: payment,
              registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
          });

          alert("Successfully registered for the event!");
          window.location.href = "events.html"; // Redirect to events list page

      } catch (error) {
          console.error("Error registering for event:", error);
          alert("Failed to register for the event.");
      }
  });
});
