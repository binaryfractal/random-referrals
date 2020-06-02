import * as functions from "firebase-functions";

import { app, server } from "./config/api.config";
import { referralController } from "./infrastructure/referral.controller";

app.get(":company", referralController.getRandomCode);
app.post(":company/:code", referralController.saveCode);

export const api = functions.https.onRequest(server);
