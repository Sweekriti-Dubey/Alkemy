const allowedAdminEmails = ["sweekritidubey1@gmail.com", "sweekritidubey13@gmail.com", "kuhudubey77@gmail.com"];
const allowedOrganizerEmails = ["organizer1@example.com", "organizer2@example.com"]; // Add organizer emails here

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const errorMessage = document.getElementById("error-message");
    const googleSignUpBtn = document.getElementById("googleSignUpBtn");

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

                // Check if user exists in Firestore
                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                if (userDoc.exists) {
                    errorMessage.textContent = "User already exists. Please log in.";
                    errorMessage.classList.remove("hidden");
                    return;
                }

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
                    role: role,
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

    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener("click", async () => {
            const provider = new firebase.auth.GoogleAuthProvider();

            try {
                await firebase.auth().signInWithRedirect(provider);
            } catch (error) {
                errorMessage.textContent = `Error signing in with Google: ${error.message}`;
                errorMessage.classList.remove("hidden");
            }
        });
    }

    // Handle the redirect result
    firebase.auth().getRedirectResult().then(async (result) => {
        if (result.user) {
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
            if (userDoc.exists) {
                errorMessage.textContent = "User already exists. Please log in.";
                errorMessage.classList.remove("hidden");
                return;
            }

            // Determine user role based on email
            let role;
            if (allowedAdminEmails.includes(user.email)) {
                role = "admin";
            } else if (allowedOrganizerEmails.includes(user.email)) {
                role = "organizer";
            } else {
                role = "user";
            }

            // Store user details in Firestore
            await firebase.firestore().collection("users").doc(user.uid).set({
                email: user.email,
                role: role,
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
        }
    }).catch((error) => {
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = `Error signing in with Google: ${error.message}`;
        errorMessage.classList.remove("hidden");
    });
});
