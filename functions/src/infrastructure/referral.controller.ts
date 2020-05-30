import { Response } from "express";
import { Controller, Get, Param, Res, HttpStatus, Post } from "@nestjs/common";
import { GetRandomCode } from "../application/usecases/get-random-code.usecase";
import { ReferralService } from "./referral.service";
import { SaveCode } from "../application/usecases/save-code.usecase";

@Controller("/")
export class ReferralController {
  private readonly getRandomCodeUsecase: GetRandomCode<ReferralService>;
  private readonly saveCodeUsecase: SaveCode<ReferralService>;

  constructor() {
    this.getRandomCodeUsecase = new GetRandomCode(new ReferralService());
    this.saveCodeUsecase = new SaveCode(new ReferralService());
  }

  @Get(":company")
  async getRandomCode(
    @Param("company") company: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const code: string = await this.getRandomCodeUsecase.get(company);
      res.status(HttpStatus.OK).send(code);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error.message });
    }
  }

  @Post(":company/:code")
  async saveCode(
    @Param("company") company: string,
    @Param("code") code: string,
    @Res() res: Response
  ) {
    try {
      await this.saveCodeUsecase.save(company, code);
      res.status(HttpStatus.CREATED).send(true);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: error.message });
    }
  }
}
