import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const config = functions.config().firebase;
const fb = admin.initializeApp(config);

const settings = { timestampsInSnapshots: true };
const db = admin.firestore();

db.settings(settings);

module.exports = {
  fb,
  db,
};

export { fb, db };
