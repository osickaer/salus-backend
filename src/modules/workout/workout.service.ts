import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { StrengthExercises } from "src/entities/StrengthExercises";
import { Workouts } from "src/entities/Workouts";
import { StrengthTrainingDetails } from "src/entities/StrengthTrainingDetails";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class WorkoutService {
  constructor(private readonly em: EntityManager) {}

  async getWorkoutHistory(userId: string): Promise<any[]> {
    const sql = `
      SELECT 
        w.workout_id AS "workoutId",
        w.workout_type AS "workoutType",
        w.workout_date AS "workoutDate",
        w.workout_name AS "workoutName",
        ARRAY_AGG(DISTINCT s.exercise_name) AS "exerciseNames"
      FROM
        workouts w
      JOIN
        strength_training_details s ON w.workout_id = s.workout_id
      GROUP BY
        w.workout_id, w.workout_type, w.workout_date, w.workout_name
      ORDER BY
        w.workout_date DESC, w.workout_id DESC;
    `;

    const workouts = await this.em.getConnection().execute(sql, [userId]);

    return workouts;
  }

  async getStrengthExercises(): Promise<any[]> {
    const exercises = await this.em.find(
      StrengthExercises,
      {},
      {
        fields: [
          "exerciseName",
          "force",
          "primaryMuscles",
          "category",
          "images",
          "priority",
        ],
        orderBy: { priority: "ASC" },
      }
    );

    return exercises || [];
  }

  async logStrengthWorkout(
    userId: string,
    workoutName: string,
    workoutNotes: string,
    workoutDate: string,
    strengthExercises: {
      exerciseName: string;
      sets: {
        setNum: number;
        reps: string | number;
        weight: string | number;
      }[];
    }[]
  ): Promise<bigint> {
    // Start a transaction
    const workoutId = await this.em.transactional(async (em) => {
      // Insert a new workout
      const newWorkout = em.create(Workouts, {
        user: userId, // Assuming userId is the primary key or reference
        workoutName,
        workoutNotes,
        workoutDate: new Date(workoutDate),
        workoutType: "strength_training", // Example workout type
      });

      await em.persistAndFlush(newWorkout);

      // Insert each strength exercise
      for (const exercise of strengthExercises) {
        for (const set of exercise.sets) {
          const newDetail = em.create(StrengthTrainingDetails, {
            workout: newWorkout,
            exerciseName: exercise.exerciseName,
            setNum: set.setNum,
            reps: parseFloat(set.reps as string) || 0, // Handle string or number
            weight: parseFloat(set.weight as string) || 0, // Handle string or number
          });
          await em.persistAndFlush(newDetail);
        }
      }

      // Return the workout ID for reference
      return newWorkout.workoutId;
    });

    return workoutId;
  }

  async deleteWorkout(userId: string, workoutId: string): Promise<void> {
    await this.em.transactional(async (em) => {
      // Find the workout
      const workout = await em.findOne(Workouts, {
        workoutId: BigInt(workoutId),
        user: userId,
      });

      if (!workout) {
        throw new BadRequestException("Workout not found or not authorized.");
      }

      // Remove the workout
      await em.removeAndFlush(workout);
    });
  }
}
