const allowedAdminEmails = ["sweekritidubey1@gmail.com", "sweekritidubey13@gmail.com", "kuhudubey77@gmail.com"];
const allowedOrganizerEmails = ["organizer1@example.com", "organizer2@example.com"];

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const errorMessage = document.getElementById("error-message");

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Get input values
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            // Clear error message
            errorMessage.classList.add("hidden");

            try {
                // Create user with Firebase Authentication
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Send request to Netlify function to set custom claims
                const response = await fetch('/.netlify/functions/setCustomClaims', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        uid: user.uid,
                        email: user.email
                    })
                });

                const result = await response.json();
                if (response.status !== 200) {
                    throw new Error(result.error || 'Failed to set custom claims');
                }

                // Redirect based on user role
                await firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
                    const role = idTokenResult.claims.role;
                    if (role === 'admin') {
                        window.location.href = "admin.html";
                    } else if (role === 'organizer') {
                        window.location.href = "organizerhomepage.html";
                    } else {
                        window.location.href = "userhomepage.html";
                    }
                });

            } catch (error) {
                errorMessage.textContent = `Error signing up: ${error.message}`;
                errorMessage.classList.remove("hidden");
            }
        });
    }
});
