document.addEventListener("DOMContentLoaded", function () {
  const manageEventsBtn = document.getElementById("createEventBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userRoleDisplay = document.getElementById("userRoleDisplay");
  const adminControls = document.getElementById("adminControls");
  const userControls = document.getElementById("userControls");
  const categoryButtons = document.querySelectorAll(".category-btn");

  // Function to get user role from Firestore
  async function getUserRole() {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
        return userDoc.exists ? userDoc.data().role : "user"; // Default to 'user' if role not found
      } catch (error) {
        console.error("Error fetching user role:", error);
        return "user";
      }
    }
    return "user"; // Default to 'user' if no user is logged in
  }

  // Function to display user role and controls
  async function displayUserRole() {
    const role = await getUserRole();
    userRoleDisplay.textContent = `Logged in as: ${role}`;

    if (role === "admin") {
      adminControls.classList.remove("hidden");
      userControls.classList.add("hidden");
    } else {
      userControls.classList.remove("hidden");
      adminControls.classList.add("hidden");
    }
  }

  // Listen for authentication state changes
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      displayUserRole();
    }
  });

  // Event listener for Create Event button (Admin)
  if (manageEventsBtn) {
    manageEventsBtn.addEventListener("click", () => {
      window.location.href = "create-event.html"; // Redirect to Create Event page
    });
  }

  // Event listener for Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      firebase.auth().signOut().then(() => {
        window.location.href = "../index.html"; // Redirect to homepage
      }).catch((error) => {
        console.error("Logout Error:", error);
      });
    });
  }

  // Event listener for Explore buttons (redirect to respective event category pages)
  categoryButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const categoryElement = event.target.closest(".event-category");
      if (categoryElement) {
        const category = categoryElement.getAttribute("data-category");
        if (category) {
          window.location.href = `events-${category}.html`; // Redirect to category page
        }
      }
    });
  });
});
