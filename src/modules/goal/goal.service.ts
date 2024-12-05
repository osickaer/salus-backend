import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserGoals } from "src/entities/UserGoals";

@Injectable()
export class GoalService {
  constructor(private readonly em: EntityManager) {}

  async getUserGoal(userId: string): Promise<UserGoals> {
    const goal = await this.em.findOne(
      UserGoals,
      { user: userId },
      { orderBy: { goalTimestamp: "DESC" } }
    );

    if (!goal) {
      throw new NotFoundException(`Goal for user ID ${userId} not found`);
    }

    return goal;
  }
}
