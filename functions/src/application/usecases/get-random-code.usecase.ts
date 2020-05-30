export interface GetRandomCodePort {
  get(company: string): Promise<string>;
}

export class GetRandomCode<T extends GetRandomCodePort> {
  constructor(private readonly port: T) {}

  async get(company: string): Promise<string> {
    return await this.port.get(company);
  }
}
