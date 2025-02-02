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
                // Check if user already exists in Firestore
                const userDoc = await firebase.firestore().collection("users").where("email", "==", email).get();
                if (!userDoc.empty) {
                    errorMessage.textContent = "User already exists. Please log in.";
                    errorMessage.classList.remove("hidden");
                    return;
                }

                // Create user with Firebase Authentication
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Determine user role based on email
                let role;
                if (allowedAdminEmails.includes(email)) {
                    role = "admin";
                } else if (allowedOrganizerEmails.includes(email)) {
                    role = "organizer";
                } else {
                    role = "user";
                }

                // Store user details in Firestore
                await firebase.firestore().collection("users").doc(user.uid).set({
                    email: email,
                    role: role,  // 'admin', 'organizer', or 'user'
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });

                // Redirect based on user role
                if (role === "admin") {
                    window.location.href = "admin.html";
                } else if (role === "organizer") {
                    window.location.href = "organizerhomepage.html";
                } else {
                    window.location.href = "userhomepage.html";
                }
            } catch (error) {
                errorMessage.textContent = `Error signing up: ${error.message}`;
                errorMessage.classList.remove("hidden");
            }
        });
    }
});
