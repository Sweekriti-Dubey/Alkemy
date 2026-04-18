const firebaseConfig = {
  apiKey: "AIzaSyAM3LdikxW7e__28mEIxW7hPpsAhfz-gks",
  authDomain: "alkkemy.firebaseapp.com",
  projectId: "alkkemy",
  storageBucket: "alkkemy.appspot.com",
  messagingSenderId: "989875387392",
  appId: "1:989875387392:web:43f491edb9b1ff49e42ce5",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized successfully");
} else {
  firebase.app();
  console.log("✅ Using existing Firebase app");
}

const auth = firebase.auth();
const db = firebase.firestore();

async function checkAdminStatus(user) {
  if (!user) return;

  try {
    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();

    if (doc.exists) {
      const userData = doc.data();
      if (userData.role === "admin") {
        console.log("🚀 Admin Logged In:", user.email);
      } else {
        console.log("🔹 Regular User Logged In:", user.email);
      }
    } else {
      console.warn("⚠️ No user document found for:", user.uid);
    }
  } catch (error) {
    console.error("❌ Error fetching user role:", error.message);
  }
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log("🔹 User logged in:", user.email);
    await checkAdminStatus(user);

    try {
      const eventsSnapshot = await db.collection("events").doc("category1").collection("allEvents").get();
      console.log("✅ Firestore data fetched:", eventsSnapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error("❌ Firestore fetch error:", error.message);
    }
  } else {
    console.log("⚠️ User not logged in.");
  }
});