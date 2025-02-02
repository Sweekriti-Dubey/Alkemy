// filepath: /netlify/functions/setCustomClaims.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com'
  });
}

exports.handler = async (event, context) => {
  try {
    const { uid, email } = JSON.parse(event.body);

    // Set custom claims
    let role = 'user';
    if (allowedAdminEmails.includes(email)) {
      role = 'admin';
    } else if (allowedOrganizerEmails.includes(email)) {
      role = 'organizer';
    }

    await admin.auth().setCustomUserClaims(uid, { role });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Custom claims set successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};