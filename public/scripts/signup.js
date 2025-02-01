const allowedAdminEmails = ["sweekritidubey1@gmail.com", "sweekritidubey13@gmail.com", "kuhudubey77@gmail.com"];

function validatePassword(password) {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password);
}

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const errorMessage = document.getElementById("error-message");
    const googleSignUpBtn = document.getElementById("googleSignUpBtn");

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!validatePassword(password)) {
                errorMessage.textContent = "Password must include uppercase, lowercase, number, and special character.";
                errorMessage.classList.remove("hidden");
                return;
            }

            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                const role = allowedAdminEmails.includes(email) ? "admin" : "user";

                await firebase.firestore().collection("users").doc(user.uid).set({
                    email: email,
                    role: role,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });

                window.location.href = role === "admin" ? "admin.html" : "userhomepage.html";
            } catch (error) {
                errorMessage.textContent = `Error signing up: ${error.message}`;
                errorMessage.classList.remove("hidden");
            }
        });
    }

    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener("click", async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });

            try {
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;
                const role = allowedAdminEmails.includes(user.email) ? "admin" : "user";

                await firebase.firestore().collection("users").doc(user.uid).set({
                    email: user.email,
                    role: role,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                }, { merge: true });

                window.location.href = role === "admin" ? "admin.html" : "userhomepage.html";
            } catch (error) {
                errorMessage.textContent = `Error signing in with Google: ${error.message}`;
                errorMessage.classList.remove("hidden");
            }
        });
    }
});
