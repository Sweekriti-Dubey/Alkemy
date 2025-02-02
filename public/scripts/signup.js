document.addEventListener("DOMContentLoaded", function () {
    const googleSignUpBtn = document.getElementById("googleSignUpBtn");
    const errorMessage = document.getElementById("error-message");
    const adminEmails = ["sweekritidubey13@gmail.com", "kuhudubey77@gmail.com"];

    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener("click", async () => {
            // Clear error message
            errorMessage.classList.add("hidden");

            try {
                // Sign in user with Google
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;

                // Check if the user already exists
                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                if (userDoc.exists) {
                    errorMessage.textContent = "Account already exists.";
                    errorMessage.classList.remove("hidden");
                    return;
                }

                // Determine user role
                let role = "user";
                if (adminEmails.includes(user.email)) {
                    role = "admin";
                }

                // Create user profile in Firestore with the role
                await firebase.firestore().collection("users").doc(user.uid).set({
                    email: user.email,
                    role: role,
                });

                // Redirect based on user role
                if (role === "admin") {
                    window.location.href = "admin.html";
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