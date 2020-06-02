import * as functions from "firebase-functions";

import { app, server } from "./config/api.config";
import { referralController } from "./infrastructure/referral.controller";

export const api = functions.https.onRequest(server);

app.get(":company", referralController.getRandomCode);
app.post(":company/:code", referralController.saveCode);
