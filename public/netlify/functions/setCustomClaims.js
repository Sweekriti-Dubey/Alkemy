const admin = require('firebase-admin');
admin.initializeApp();

exports.handler = async function(event, context) {
    // Ensure user is signed in and ID is passed from frontend
    const { uid, email } = JSON.parse(event.body);

    let role = 'user'; // default role
    if (['sweekritidubey1@gmail.com', 'sweekritidubey13@gmail.com', 'kuhudubey77@gmail.com'].includes(email)) {
        role = 'admin';
    } else if (['organizer1@example.com', 'organizer2@example.com'].includes(email)) {
        role = 'organizer';
    }

    try {
        await admin.auth().setCustomUserClaims(uid, { role: role });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Custom claims set for ${uid}: ${role}` })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error setting custom claims', details: error })
        };
    }
};
