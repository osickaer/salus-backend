import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Workouts } from "src/entities/Workouts";

interface StrengthExercise {
  exerciseName: string;
  sets: {
    setNum: number;
    reps: number | string; // Allow string during input handling
    weight: number | string; // Allow string during input handling
  }[];
  notes?: string; // Optional notes for each exercise
}

@Controller("workout")
export class WorkoutController {
  constructor(private readonly WorkoutService: WorkoutService) {}

  @UseGuards(JwtAuthGuard)
  @Get("strengthWorkoutHistory")
  async getStrengthWorkoutHistory(
    @Request() req
  ): Promise<Partial<Workouts>[]> {
    // Use userId from the JWT payload attached by JwtAuthGuard
    return this.WorkoutService.getWorkoutHistory(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("strengthExercises")
  async getStrengthExercises(@Request() req): Promise<Partial<Workouts>[]> {
    // Use userId from the JWT payload attached by JwtAuthGuard
    return this.WorkoutService.getStrengthExercises();
  }

  @UseGuards(JwtAuthGuard)
  @Post("logStrengthWorkout")
  async logStrengthWorkout(
    @Request() req,
    @Body()
    body: {
      workoutName: string;
      workoutNotes: string;
      workoutDate: string;
      strengthExercises: StrengthExercise[];
    }
  ): Promise<{ message: string; workoutId?: string }> {
    const userId = req.user.userId;
    const { workoutName, workoutNotes, workoutDate, strengthExercises } = body;

    if (!workoutName || !strengthExercises || strengthExercises.length === 0) {
      throw new BadRequestException("Workout name and exercises are required.");
    }

    try {
      const workoutId = await this.WorkoutService.logStrengthWorkout(
        userId,
        workoutName,
        workoutNotes,
        workoutDate,
        strengthExercises
      );

      if (!workoutId) {
        throw new Error("Failed to log the workout."); // Custom application-level error
      }

      return {
        message: "Workout logged successfully.",
        workoutId: workoutId.toString(),
      };
    } catch (error) {
      console.error("Error logging workout:", error); // Log error for debugging
      throw new BadRequestException("Failed to log the workout."); // Send a clean error to the client
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":workoutId")
  async deleteWorkout(
    @Request() req,
    @Param("workoutId") workoutId: string
  ): Promise<{ message: string }> {
    const userId = req.user.userId;

    if (!workoutId) {
      throw new BadRequestException("Workout ID is required.");
    }

    try {
      await this.WorkoutService.deleteWorkout(userId, workoutId);
      return { message: "Workout deleted successfully." };
    } catch (error) {
      console.error("Error deleting workout:", error);
      throw new BadRequestException("Failed to delete the workout.");
    }
  }
}
