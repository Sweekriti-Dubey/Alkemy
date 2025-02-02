document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("signupBtn").addEventListener("click", function () {
      window.location.href = "signup.html"; // Redirect to Sign-up Page
  });

  document.getElementById("loginBtn").addEventListener("click", function () {
      window.location.href = "login.html"; // Redirect to Login Page
  });

  document.getElementById("googleLoginBtn").addEventListener("click", async () => {
      try {
          const provider = new firebase.auth.GoogleAuthProvider();
          const result = await firebase.auth().signInWithPopup(provider);
          const user = result.user;

          const adminDoc = await firebase.firestore().collection("admins").doc(user.email).get();
          let role = "user";
          if (adminDoc.exists) {
              role = "admin";
          }

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
          console.error("Google Login Error:", error.message);
          alert("Error signing in: " + error.message);
      }
  });
});