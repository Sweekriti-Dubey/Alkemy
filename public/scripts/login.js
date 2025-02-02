document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("error-message");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Get input values
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            // Clear error message
            errorMessage.classList.add("hidden");

            try {
                // Sign in user with Firebase Authentication
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Check if email is verified
                if (!user.emailVerified) {
                    errorMessage.textContent = "Please verify your email address.";
                    errorMessage.classList.remove("hidden");
                    return;
                }

                // Check user role in Firestore
                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const role = userData.role;

                    // Redirect based on user role
                    if (role === "admin") {
                        window.location.href = "admin.html";
                    } else if (role === "organizer") {
                        window.location.href = "organizerhomepage.html";
                    } else {
                        window.location.href = "userhomepage.html";
                    }
                } else {
                    errorMessage.textContent = "User data not found.";
                    errorMessage.classList.remove("hidden");
                }
            } catch (error) {
                errorMessage.textContent = `Error logging in: ${error.message}`;
                errorMessage.classList.remove("hidden");
            }
        });
    }
});