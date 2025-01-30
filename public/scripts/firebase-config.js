// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDTau2Bd9AT_GfRs5EhmWX3RUoH6_FUy0c",
  authDomain: "alkemywebsite-31ace.firebaseapp.com",
  projectId: "alkemywebsite-31ace",
  storageBucket: "alkemywebsite-31ace.firebasestorage.app",
  messagingSenderId: "1046324386369",
  appId: "1:1046324386369:web:94be34f0608c43b80b84c0",
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase initialized with project ID:", firebaseConfig.projectId);