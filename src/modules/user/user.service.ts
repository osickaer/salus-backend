import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/entities/User.entity";
import { UserBodyWeight } from "src/entities/UserBodyWeight.entity";

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}
  getGreeting(): string {
    return "Hello, User!";
  }

  async getUserById(userId: string): Promise<User> {
    // Find the user by ID
    const user = await this.em.findOne(User, { userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async getCurrentBodyWeight(userId: string): Promise<UserBodyWeight> {
    // Find the user by ID
    const recentWeight = await this.em.findOne(
      UserBodyWeight,
      { user: { userId } },
      { orderBy: { weightTimestamp: "DESC" } }
    ); // Order by timestamp descending);
    if (!recentWeight) {
      throw new NotFoundException(`No weight found for user with ID ${userId}`);
    }
    return recentWeight;
  }

  async getUserWithBodyWeights(userId: string): Promise<User> {
    const user = await this.em.findOne(
      User,
      { userId },
      { populate: ["bodyWeights"] }
    ); // Correct usage

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
