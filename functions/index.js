// The Cloud Functions for Firebase SDK to create Cloud Functions


// and set up triggers.
// const { firestore } = require('firebase-functions');
const {info: logInfo, error: logError} = require("firebase-functions/logger");
const {onRequest} = require("firebase-functions/v2/https");
// const {defineSecret} = require("firebase-functions/params");
const axios = require("axios");
const qs = require("qs");

// The Firebase Admin SDK to access Firestore.
// const {initializeApp, _firestore: firestore} = require('firebase-admin');
const admin = require("firebase-admin");
admin.initializeApp();

// const recaptchaKey = defineSecret("GD1279_RECAPTCHA_SECRET_KEY");


exports.helloWorld = onRequest({cors: true}, (request, response) => {
  logInfo("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// export const addMessage = onRequest({cors: true}, async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   const writeResult = await _firestore()
//     .collection('messages')
//     .add({ original: original })
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Message with ID: ${writeResult.id} added.` })
// })

// export const makeUppercase = firestore
//   .document('/messages/{documentId}')
//   .onCreate((snap, context) => {
//     // Grab the current value of what was written to Firestore.
//     const original = snap.data().original

//     // Access the parameter `{documentId}` with `context.params`
//     log('Uppercasing', context.params.documentId, original)

//     const uppercase = original.toUpperCase()

//     // You must return a Promise when performing asynchronous tasks inside
//     // writing to Firestore.
//     // Setting an 'uppercase' field in Firestore document returns a Promise.
//     return snap.ref.set({ uppercase }, { merge: true })
//   })

exports.verifyRecaptcha = onRequest(
    {
      cors: [/firebase\.com$/, /gureckislab\.org$/,
        "localhost", "localhost:3010"],
    },
    (req, res) => {
      const requestData = {
        // secret: recaptchaKey.value(),
        secret: process.env.GD1279_RECAPTCHA_SECRET_KEY,
        response: req.body.token,
        remoteip: req.body.ip,
      };

      axios.post("https://www.google.com/recaptcha/api/siteverify", qs.stringify(requestData))
          .then((response) => {
            logInfo(response.data);
            res.status(200).send(response.data);
          }).catch((error) => {
            logError(error);
            res.status(500).send(error);
          });
    });
