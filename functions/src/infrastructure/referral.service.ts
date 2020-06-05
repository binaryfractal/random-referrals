import { GetRandomCodePort } from "../application/usecases/get-random-code.usecase";
import { SaveCodePort } from "../application/usecases/save-code.usecase";
import { GetMostGeneratedCodesPort } from "../application/usecases/get-most-generated-codes.usecase";
import {
  DocumentSnapshot,
  WriteBatch,
  QuerySnapshot,
} from "@google-cloud/firestore";
import { db } from "../config/app.config";
import { Code } from "../domain/models/code";

export class ReferralService
  implements GetRandomCodePort, SaveCodePort, GetMostGeneratedCodesPort {
  async get(company: string): Promise<string> {
    const companySnapshot: DocumentSnapshot = await db
      .collection(company)
      .doc("--ids--")
      .get();

    let randomCode: string = "";
    if (companySnapshot.exists) {
      if (companySnapshot.data() !== undefined) {
        const maxId: number = companySnapshot.get("maxId");
        const randomId = await this.getRandomId(1, maxId);
        const randomCodeSnapshot: DocumentSnapshot = await db
          .collection(company)
          .doc(randomId.toString())
          .get();

        if (randomCodeSnapshot.exists) {
          if (randomCodeSnapshot.data() !== undefined) {
            randomCode = randomCodeSnapshot.get("code");
            const active: boolean = randomCodeSnapshot.get("active");

            if (!active) {
              randomCode = await this.get(company);
            }

            await this.updateCounter(randomCodeSnapshot);
          }
        }
      }
    }

    return randomCode;
  }

  async save(company: string, code: string): Promise<void> {
    const batch: WriteBatch = db.batch();

    const codeExistsSnapshot: QuerySnapshot = await db
      .collection(company)
      .where("code", "==", code)
      .get();

    if (codeExistsSnapshot.empty) {
      const companySnapshot: DocumentSnapshot = await db
        .collection(company)
        .doc("--ids--")
        .get();

      if (companySnapshot.exists) {
        if (companySnapshot.data() !== undefined) {
          const maxId: number = companySnapshot.get("maxId");

          batch.create(
            db.collection(company).doc(`${(maxId + 1).toString()}`),
            {
              active: true,
              code: code,
            }
          );

          batch.update(db.collection(company).doc("--ids--"), {
            maxId: maxId + 1,
          });

          await batch.commit();
        }
      }
    }
  }

  async getAll(company: string, limit: number): Promise<Array<Code>> {
    const codes: Array<Code> = new Array<Code>();
    const querySnapshot: QuerySnapshot = await db
      .collection(company)
      .orderBy("count", "desc")
      .limit(limit)
      .get();

    for (let snapshot of querySnapshot.docs) {
      if (snapshot.exists) {
        if (snapshot !== undefined) {
          const code: Code = {} as Code;
          code.code = snapshot.get("code");
          code.count = snapshot.get("count");

          codes.push(code);
        }
      }
    }

    return codes;
  }

  private async updateCounter(snapshot: DocumentSnapshot): Promise<void> {
    const batch = db.batch();

    let currentCount: number = 0;
    if (snapshot.get("count")) {
      currentCount = snapshot.get("count");
    }

    batch.update(snapshot.ref, {
      count: currentCount + 1,
    });

    await batch.commit();
  }

  private async getRandomId(min: number, max: number): Promise<number> {
    const minRange = Math.ceil(min);
    const maxRange = Math.floor(max);
    return Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
  }
}
