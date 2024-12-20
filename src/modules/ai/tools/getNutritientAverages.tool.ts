import { tool } from "@langchain/core/tools";
import { getContextVariable } from "@langchain/core/context";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";

@Injectable()
export class GetNutrientAveragesTool {
  constructor(private readonly em: EntityManager) {}

  // Function to fetch 2-week average nutrient data
  async get2WeekAvgNutrients(userId: string): Promise<string> {
    try {
      console.log("USERID: ", userId);
      const sql = `SELECT * FROM calculate_macro_averages(?)`;
      const results = await this.em.getConnection().execute(sql, [userId]);

      if (!results || results.length === 0) {
        return `User ID ${userId} has no macronutrient data recorded.\n`;
      }

      const { average_calories, average_protein, average_fat, average_carbs } =
        results[0];

      return `
        Athlete's 2-week macronutrient consumption averages per day:
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
      async (): Promise<string> => {
        const userId = getContextVariable("userId"); // Retrieve userId from context
        if (!userId) {
          throw new Error(
            `No "userId" found in current context. Remember to call "setContextVariable('userId', value)";`
          );
        }
        return this.get2WeekAvgNutrients(userId);
      },
      {
        name: "getAvgNutrients",
        description: "Fetches the 2-week average macronutrient data for a user",
        schema: null, // No schema needed
      }
    );
  }
}
