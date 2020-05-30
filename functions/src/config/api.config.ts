import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import express from "express";

const server = express();

const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );

  return app.init();
};

createNestServer(server)
  .then((v) => console.log("Nest Ready"))
  .catch((err) => console.error("Nest broken", err));

export { server };
