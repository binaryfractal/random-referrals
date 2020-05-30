export interface SaveCodePort {
  save(company: string, code: string): Promise<void>;
}

export class SaveCode<T extends SaveCodePort> {
  private readonly port: T;

  constructor(port: T) {
    this.port = port;
  }

  async save(company: string, code: string): Promise<void> {
    await this.port.save(company, code);
  }
}
