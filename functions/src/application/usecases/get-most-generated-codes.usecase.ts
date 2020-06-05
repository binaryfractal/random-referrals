import { Code } from "../../domain/models/code";

export interface GetMostGeneratedCodesPort {
  getAll(company: string, limit: number): Promise<Array<Code>>;
}

export class GetMostGeneratedCodes<T extends GetMostGeneratedCodesPort> {
  constructor(private readonly port: T) {}

  async getAll(company: string, limit: number): Promise<Array<Code>> {
    return await this.port.getAll(company, limit);
  }
}
