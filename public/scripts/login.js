document.addEventListener("DOMContentLoaded", function () {
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const errorMessage = document.getElementById("error-message");
    const adminEmails = ["sweekritidubey13@gmail.com", "kuhudubey77@gmail.com"];

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", async () => {
            // Clear error message
            errorMessage.classList.add("hidden");

            try {
                // Sign in user with Google
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;

                // Determine user role
                let role = "user";
                if (adminEmails.includes(user.email)) {
                    role = "admin";
                }

                // Redirect based on user role
                if (role === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "userhomepage.html";
                }
            } catch (error) {
                errorMessage.textContent = `Error logging in: ${error.message}`;
                errorMessage.classList.remove("hidden");
            }
        });
    }
});