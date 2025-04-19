import { tool } from "@langchain/core/tools";
import { getContextVariable } from "@langchain/core/context";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { z } from "zod";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

@Injectable()
export class GetStrengthProgress {
  constructor(private readonly em: EntityManager) {}

  // Function to fetch 2-week average nutrient data
  async getStrengthProgress(
    userId: string,
    userFullName: string,
    primaryMuscles: string[]
  ): Promise<string> {
    try {
      const sql = `SELECT
            DATE(workout_date) AS workout_date,
            exercise_name,
            num_sets,
            ROUND(avg_reps::numeric, 2) AS avg_reps,
            ROUND(avg_weight::numeric, 2) AS avg_weight,
            primary_muscles
          FROM strength_exercise_progress
          WHERE user_id = ?
          AND primary_muscles && ARRAY[?]
          LIMIT 5;`;

      const results = await this.em
        .getConnection()
        .execute(sql, [userId, primaryMuscles]);

      if (!results || results.length === 0) {
        return `User ID ${userId} has no macronutrient data recorded.\n`;
      }

      let exerciseContext = `\n${userFullName}'s strength progression for ${primaryMuscles} ordered by date descending:\n`;

      for (const data of results) {
        const { workout_date, exercise_name, num_sets, avg_reps, avg_weight } =
          data;

        exerciseContext += `On ${workout_date}, the ${userFullName} did ${num_sets} sets of ${exercise_name} for an average of ${avg_reps} reps with an average of ${avg_weight} lbs.\n`;
      }

      return exerciseContext;
    } catch (error) {
      console.error(
        `Error retrieving user strength progress: ${error.message}`
      );
      throw new Error("Failed to retrieve strength progress.");
    }
  }

  // Define the LangChain tool
  get tool() {
    const toolSchema = z.object({
      primaryMuscles: z
        .array(
          z.enum([
            "abductors",
            "biceps",
            "lower back",
            "glutes",
            "calves",
            "quadriceps",
            "shoulders",
            "triceps",
            "neck",
            "adductors",
            "chest",
            "abdominals",
            "hamstrings",
            "forearms",
            "traps",
            "middle back",
            "lats",
          ])
        )
        .describe(
          "The primary muscles to search for (e.g. abdominals, lats, middle back, hamstrings, quadriceps, chest, glutes, etc.)."
        ),
    });

    return tool(
      async (input, config: LangGraphRunnableConfig): Promise<string> => {
        const { primaryMuscles } = input;
        // const userId = getContextVariable("userId"); // Retrieve userId from context
        // const userFullName = getContextVariable("userFullName"); // Retrieve userId from context
        const userId = config.configurable?.userId;
        const userFullName = config.configurable?.userFullName;
        if (!userId || !userFullName) {
          throw new Error(
            `No "userId" or "userFullName" found in current config.";`
          );
        }
        return this.getStrengthProgress(userId, userFullName, primaryMuscles);
      },
      {
        name: "get_strength_progress",
        description:
          "Fetches the latest 5 workouts for a specific primary muscle.",
        schema: toolSchema, // Ensure schema matches expected input
      }
    );
  }
}
