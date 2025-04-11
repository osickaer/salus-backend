import { tool } from "@langchain/core/tools";
import { getContextVariable } from "@langchain/core/context";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { z } from "zod";

@Injectable()
export class GetLatestWorkout {
  constructor(private readonly em: EntityManager) {}

  // Function to fetch 2-week average nutrient data
  async getLatestWorkout(
    userId: string,
    userFullName: string,
    workoutType: string
  ): Promise<string> {
    try {
      console.log("USERID: ", userId);
      const sql = `SELECT
            *
          FROM
            latest_workout
          WHERE
            user_id = ?
            AND workout_type = ?`;

      const results = await this.em
        .getConnection()
        .execute(sql, [userId, workoutType]);

      if (!results || results.length === 0) {
        return `User ID ${userId} has no workout data recorded.\n`;
      }

      let workoutContext = `${userFullName}'s latest workout details:\n`;

      if (results[0]["workout_notes"]) {
        workoutContext += `Notes - ${results[0]["workout_notes"]}\n`;
      }

      for (const data of results)
        if (data["workout_type"] == "strength_training") {
          const { exercise_name, set_num, reps, weight, workout_date } = data;

          workoutContext += `${exercise_name} set ${set_num}: ${reps} x ${weight} lbs\n`;
        } else if (data["workout_type"] == "cardio") {
          const {
            exercise_name,
            intensity,
            duration_minutes,
            calories_burned,
            workout_date,
          } = data;

          workoutContext += `On ${workout_date}, ${userFullName} did ${exercise_name} for ${duration_minutes} minutes at an intensity of ${intensity} and burned ${calories_burned} calories\n`;
        }

      return workoutContext;
    } catch (error) {
      console.error(`Error retrieving user latest workout: ${error.message}`);
      throw new Error("Failed to retrieve latest workout.");
    }
  }

  // Define the LangChain tool
  get tool() {
    const toolSchema = z.object({
      workoutType: z
        .enum(["strength_training", "cardio"])
        .describe(
          "The type of workout to search for. Can either be strength_training or ."
        ),
    });

    return tool(
      async ({
        workoutType,
      }: {
        workoutType: z.infer<typeof toolSchema>["workoutType"];
      }): Promise<string> => {
        const userId = getContextVariable("userId"); // Retrieve userId from context
        const userFullName = getContextVariable("userFullName"); // Retrieve userId from context
        if (!userId) {
          throw new Error(
            `No "userId" found in current context. Remember to call "setContextVariable('userId', value)";`
          );
        }
        return this.getLatestWorkout(userId, userFullName, workoutType);
      },
      {
        name: "getLatestWorkout",
        description: "Fetches the latest workouts for specified workout type.",
        schema: toolSchema, // Ensure schema matches expected input
      }
    );
  }
}
