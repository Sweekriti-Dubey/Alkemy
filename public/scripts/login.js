document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("error-message");
    const googleLoginBtn = document.getElementById("googleLoginBtn");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            try {
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                const user = userCredential.user;

                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                if (userDoc.exists) {
                    const role = userDoc.data().role;
                    window.location.href = role === "admin" ? "admin.html" : "userhomepage.html";
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

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });

            try {
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;

                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
                if (userDoc.exists) {
                    const role = userDoc.data().role;
                    window.location.href = role === "admin" ? "admin.html" : "userhomepage.html";
                } else {
                    errorMessage.textContent = "User data not found.";
                    errorMessage.classList.remove("hidden");
                }
            } catch (error) {
                errorMessage.textContent = `Error signing in with Google: ${error.message}`;
                errorMessage.classList.remove("hidden");
            }
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await firebase.auth().signOut();
                window.location.href = "login.html";
            } catch (error) {
                console.error("Error logging out:", error.message);
            }
        });
    }
});
