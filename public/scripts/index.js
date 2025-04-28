const adminEmails = ["sweekritidubey13@gmail.com", "kuhudubey77@gmail.com"];

document.addEventListener("DOMContentLoaded", function () {
  const signupBtn = document.getElementById("signupBtn");
  const loginBtn = document.getElementById("loginBtn");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupLoginBtn = document.getElementById("popup-loginBtn");
  const closePopupBtn = document.getElementById("close-popup");

  async function handleGoogleSignIn(isSignUp) {
    try {
      signupBtn.disabled = true;
      loginBtn.disabled = true;

      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;

      const userRef = firebase.firestore().collection("users").doc(user.uid);
      const userDoc = await userRef.get();

      if (isSignUp && userDoc.exists) {
        popupMessage.textContent = "Account already exists. Please log in.";
        popup.classList.add("show");
        return;
      }

      let role = "user";
      if (!userDoc.exists) {
        role = adminEmails.includes(user.email) ? "admin" : "user";

        await userRef.set({
          email: user.email,
          role: role,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        role = userDoc.data().role;
      }

      localStorage.setItem("userRole", role);
      window.location.href = "main/main.html";
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.error("Google Sign-In Error: Popup closed before login.");
      } else {
        console.error("Google Sign-In Error:", error.message);
        alert("Error signing in: " + error.message);
      }
    } finally {
      signupBtn.disabled = false;
      loginBtn.disabled = false;
    }
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => handleGoogleSignIn(true));
  }
  if (loginBtn) {
    loginBtn.addEventListener("click", () => handleGoogleSignIn(false));
  }

  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", () => {
      popup.classList.remove("show");
    });
  }

  if (popupLoginBtn) {
    popupLoginBtn.addEventListener("click", () => {
      popup.classList.remove("show");
      loginBtn.click();
    });
  }
});