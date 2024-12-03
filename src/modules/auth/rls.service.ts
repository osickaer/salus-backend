import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/core";

@Injectable()
export class RLSService {
  constructor(private readonly em: EntityManager) {}

  // Set the PostgreSQL session variable for the user's ID
  async setUserSession(userId: string): Promise<void> {
    console.log(`Setting session variable for userId: ${userId}`);
    await this.em
      .getConnection()
      .execute(`SET LOCAL jwt.claims.user_id = '${userId}'`);
  }
}
