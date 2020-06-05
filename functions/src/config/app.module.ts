import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";

import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";

import { ApplicationModule } from "../application/application.module";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { DomainModule } from "../domain/domain.module";

import cors from "cors";

@Module({
  imports: [DomainModule, ApplicationModule, InfrastructureModule],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer): Promise<void> {
    const whitelist: Array<string> = [
      functions.config().hosting.url_4,
      functions.config().hosting.url_2,
      functions.config().hosting.url_3,
    ];

    var corsOptionsDelegate = function (req, callback) {
      var corsOptions;
      if (whitelist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true };
      } else {
        corsOptions = { origin: false };
      }
      callback(null, corsOptions);
    };

    const corsHandler = cors(corsOptionsDelegate);
    const urlEncodedParser = bodyParser.urlencoded({ extended: false });

    consumer
      .apply(corsHandler)
      .forRoutes({ path: "*", method: RequestMethod.ALL });

    consumer
      .apply(urlEncodedParser)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
