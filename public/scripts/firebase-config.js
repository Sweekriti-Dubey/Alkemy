const firebaseConfig = {
  apiKey: "AIzaSyAM3LdikxW7e__28mEIxW7hPpsAhfz-gks",
  authDomain: "alkkemy.firebaseapp.com",
  projectId: "alkkemy",
  storageBucket: "alkkemy.firebasestorage.app",
  messagingSenderId: "989875387392",
  appId: "1:989875387392:web:43f491edb9b1ff49e42ce5",
  
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();