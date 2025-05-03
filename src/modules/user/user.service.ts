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

  // Shows an example using find
  async getUserById(userId: string): Promise<Users> {
    // Find the user by ID
    const user = await this.em.findOne(Users, { user: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // Shows an example using query builder
  async getCurrentBodyWeight(userId: string): Promise<UserBodyWeights> {
    // Find the user by ID
    const recentWeight = this.em
      .createQueryBuilder(UserBodyWeights, "w")
      .where({ user: userId }) // optional
      .orderBy({ weightTimestamp: "DESC" })
      .limit(1)
      .getSingleResult();

    if (!recentWeight) {
      throw new NotFoundException(`No weight found for user with ID ${userId}`);
    }
    return recentWeight;
  }
}
