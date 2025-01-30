document.addEventListener("DOMContentLoaded", function() {
    // Login form submission event handler
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("error-message");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                const user = userCredential.user;

                console.log("User logged in successfully:", user.uid);

                // Check if the user is an admin
                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    console.log("User data:", userData);

                    if (userData.role === "admin") {
                        // Redirect to admin homepage
                        console.log("Redirecting to admin homepage");
                        window.location.href = "../main/admin.html";
                    } else {
                        // Redirect to user homepage or handle after login
                        console.log("Redirecting to user homepage");
                        window.location.href = "user-homepage.html"; // Replace with your user homepage
                    }
                } else {
                    console.error("No user document found");
                    if (errorMessage) {
                        errorMessage.textContent = "No user document found";
                        errorMessage.classList.remove("hidden");
                    }
                }
            } catch (error) {
                // Display user-friendly error message
                if (errorMessage) {
                    errorMessage.textContent = `Error logging in: ${error.message}`;
                    errorMessage.classList.remove("hidden");
                }
                console.error("Error logging in:", error.message);
            }
        });
    }

    // Logout button event handler
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