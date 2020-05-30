import * as bodyParser from "body-parser";

import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";

import { ApplicationModule } from "../application/application.module";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

import cors from "cors";

@Module({
  imports: [ApplicationModule, InfrastructureModule],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer): Promise<void> {
    const corsHandler = cors({ origin: true });
    const urlEncodedParser = bodyParser.urlencoded({ extended: false });

    consumer
      .apply(corsHandler)
      .forRoutes({ path: "*", method: RequestMethod.ALL });

    consumer
      .apply(urlEncodedParser)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
