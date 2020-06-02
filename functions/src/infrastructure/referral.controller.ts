import { Request, Response } from "express";
import { GetRandomCode } from "../application/usecases/get-random-code.usecase";
import { ReferralService } from "./referral.service";
import { SaveCode } from "../application/usecases/save-code.usecase";

export class ReferralController {
  private readonly getRandomCodeUsecase: GetRandomCode<ReferralService>;
  private readonly saveCodeUsecase: SaveCode<ReferralService>;

  constructor() {
    this.getRandomCodeUsecase = new GetRandomCode(new ReferralService());
    this.saveCodeUsecase = new SaveCode(new ReferralService());
  }

  async getRandomCode(req: Request, res: Response): Promise<void> {
    try {
      const code: string = await this.getRandomCodeUsecase.get(
        req.params.company
      );
      res.status(200).send(code);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async saveCode(req: Request, res: Response) {
    try {
      await this.saveCodeUsecase.save(req.params.company, req.params.code);
      res.status(201).send(true);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export const referralController: ReferralController = new ReferralController();
