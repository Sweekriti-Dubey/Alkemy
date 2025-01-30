const allowedAdminEmails = ["sweekritidubey1@gmail.com", "sweekritidubey13@gmail.com", "kuhudubey77@gmail.com"];

function validatePassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return (
        password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialChar
    );
}

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const errorMessage = document.getElementById("error-message");

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;

            // Clear error message
            errorMessage.classList.add("hidden");

            // Validate password
            if (!validatePassword(password)) {
                errorMessage.textContent = "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.";
                errorMessage.classList.remove("hidden");
                return;
            }

            // Restrict admin registration
            if (role === "admin" && !allowedAdminEmails.includes(email)) {
                errorMessage.textContent = "You are not authorized to register as an admin.";
                errorMessage.classList.remove("hidden");
                return;
            }

            try {
                // Create a user with Firebase Authentication
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                console.log("User created with UID:", user.uid);

                // Automatically create the 'users' collection and save user details
                await firebase.firestore().collection("users").doc(user.uid).set({
                    email: email,
                    role: role, // Store the user's role (admin or user)
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Optional: Add a timestamp for when the user is created
                });

                console.log("User document created in Firestore");

                alert("User signed up successfully!");
                console.log("User signed up successfully!");

                // Redirect to another page after successful signup (e.g., login page)
                window.location.href = "login.html"; // Redirect to the login page or any page after signup
            } catch (error) {
                // Display user-friendly error message if any error occurs
                errorMessage.textContent = `Error signing up: ${error.message}`;
                errorMessage.classList.remove("hidden");
                console.error("Error signing up:", error.message);
            }
        });
    }
});