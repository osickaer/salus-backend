import { tool } from "@langchain/core/tools";
import { getContextVariable } from "@langchain/core/context";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

@Injectable()
export class GetNutrientAveragesTool {
  constructor(private readonly em: EntityManager) {}

  // Function to fetch 2-week average nutrient data
  async get2WeekAvgNutrients(
    userId: string,
    userFullName: string
  ): Promise<string> {
    try {
      console.log("USERID: ", userId);
      const sql = `SELECT
      ROUND(COALESCE(average_calories, 0), 2) AS average_calories,
      ROUND(COALESCE(average_protein, 0), 2) AS average_protein,
      ROUND(COALESCE(average_fat, 0), 2) AS average_fat,
      ROUND(COALESCE(average_carbs, 0), 2) AS average_carbs
    FROM calculate_macro_averages(?);`;

      const results = await this.em.getConnection().execute(sql, [userId]);

      if (!results || results.length === 0) {
        return `User ID ${userId} has no macronutrient data recorded.\n`;
      }

      const { average_calories, average_protein, average_fat, average_carbs } =
        results[0];

      return `
${userFullName}'s 2-week macronutrient consumption averages per day:
- ${average_calories} calories
- ${average_protein}g protein
- ${average_fat}g fat
- ${average_carbs}g carbohydrates
      `;
    } catch (error) {
      console.error(`Error retrieving average nutrients: ${error.message}`);
      throw new Error("Failed to retrieve nutrient averages.");
    }
  }

  // Define the LangChain tool
  get tool() {
    return tool(
      async (_, config: LangGraphRunnableConfig): Promise<string> => {
        // const userId = getContextVariable("userId"); // Retrieve userId from context
        // const userFullName = getContextVariable("userFullName"); // Retrieve userId from context
        const userId = config.configurable?.userId;
        const userFullName = config.configurable?.userFullName;
        if (!userId || !userFullName) {
          throw new Error(
            `No "userId" or "userFullName" found in current config.";`
          );
        }
        return this.get2WeekAvgNutrients(userId, userFullName);
      },
      {
        name: "get_athlete_nutrients",
        description:
          "Fetches and summarizes the athlete's previous 2 weeks of meals and nutrient intake.",
        schema: null, // No schema needed
      }
    );
  }
}
