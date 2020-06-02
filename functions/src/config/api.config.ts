//import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";

import express from "express";
import cors from "cors";

const app = express();
const server = express();

/*
const whitelist: Array<string> = [
  functions.config().hosting.url_1,
  functions.config().hosting.url_2,
  functions.config().hosting.url_3,
];

const corsOptionsDelegate = function (req: any, callback: any) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

const corsHandler = cors(corsOptionsDelegate);
*/
const corsHandler = cors({ origin: true });

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(corsHandler);
server.use("/api", app);

export { app, server };
