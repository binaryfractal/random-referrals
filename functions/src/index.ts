import * as functions from "firebase-functions";

import { server } from "./config/api.config";

export const api = functions.https.onRequest(server);
