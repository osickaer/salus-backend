import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Users } from "src/entities/Users";
import { UserBodyWeights } from "src/entities/UserBodyWeights";

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}
  getGreeting(): string {
    return "Hello, User!";
  }

  async getUserById(userId: string): Promise<Users> {
    // Find the user by ID
    const user = await this.em.findOne(Users, { user: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async getCurrentBodyWeight(userId: string): Promise<UserBodyWeights> {
    // Find the user by ID
    const recentWeight = await this.em.findOne(
      UserBodyWeights,
      { user: userId },
      { orderBy: { weightTimestamp: "DESC" } }
    ); // Order by timestamp descending);
    if (!recentWeight) {
      throw new NotFoundException(`No weight found for user with ID ${userId}`);
    }
    return recentWeight;
  }
}
