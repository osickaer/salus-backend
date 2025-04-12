import { tool } from "@langchain/core/tools";
import { getContextVariable } from "@langchain/core/context";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { UserGoals } from "src/entities/UserGoals";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

@Injectable()
export class GetGoalsTool {
  constructor(private readonly em: EntityManager) {}

  // Function to fetch 2-week average nutrient data
  async getGoals(userId: string): Promise<string> {
    try {
      const results = await this.em.find(
        UserGoals,
        { user: userId },
        {
          fields: [
            "weightGoal",
            "bodyGoal",
            "calsGoal",
            "proteinGoal",
            "fatGoal",
            "carbGoal",
          ],
          orderBy: { goalTimestamp: "DESC" },
          limit: 1,
        }
      );

      if (!results || results.length === 0) {
        return `User ID ${userId} has no goals recorded in the database.\n`;
      }

      const { weightGoal, bodyGoal, calsGoal, proteinGoal, fatGoal, carbGoal } =
        results[0];

      return `
        Athlete's current goals: ${weightGoal}, ${bodyGoal}
        Athlete's nutrition targets:
        - ${calsGoal} calories
        - ${proteinGoal} protein
        - ${fatGoal} fat
        - ${carbGoal} carbohydrates
      `;
    } catch (error) {
      console.error(`Error retrieving user goals: ${error.message}`);
      throw new Error("Failed to retrieve user goals.");
    }
  }

  // Define the LangChain tool
  get tool() {
    return tool(
      async (_, config: LangGraphRunnableConfig): Promise<string> => {
        // const userId = getContextVariable("userId"); // Retrieve userId from context
        const userId = config.configurable?.userId;
        if (!userId) {
          throw new Error(`No "userId" found in current config.";`);
        }
        return this.getGoals(userId);
      },
      {
        name: "get_fitness_goals",
        description: "Fetches the athlete's fitness goals from the databse.",
        schema: null, // No schema needed
      }
    );
  }
}
