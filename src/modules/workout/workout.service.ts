import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { StrengthExercises } from "src/entities/StrengthExercises";
import { Workouts } from "src/entities/Workouts";

@Injectable()
export class WorkoutService {
  constructor(private readonly em: EntityManager) {}

  async getWorkoutHistory(userId: string): Promise<any[]> {
    const sql = `
        select distinct
            w.workout_id,
            w.user_id,
            w.workout_type,
            w.workout_date,
            w.workout_name,
            w.workout_notes,
            s.exercise_name
        from
            workouts w
            join strength_training_details s on w.workout_id = s.workout_id
        order by workout_date desc, workout_id desc;
    `;

    const workouts = await this.em.getConnection().execute(sql);

    return workouts || [];
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
}
