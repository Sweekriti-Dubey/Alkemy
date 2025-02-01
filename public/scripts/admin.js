document.addEventListener("DOMContentLoaded", function() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
          try {
              await firebase.auth().signOut();
              console.log("User logged out successfully!");
              // Redirect to the login page or handle after logout
              window.location.href = "../main/login.html";
          } catch (error) {
              console.error("Error logging out:", error.message);
          }
      });
  }
});