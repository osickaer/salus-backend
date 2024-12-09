import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Workouts } from "src/entities/Workouts";

@Controller("workout")
export class WorkoutController {
  constructor(private readonly WorkoutService: WorkoutService) {}

  @UseGuards(JwtAuthGuard)
  @Get("strengthWorkoutHistory")
  async getStrengthWorkoutHistory(
    @Request() req
  ): Promise<Partial<Workouts>[]> {
    // Use userId from the JWT payload attached by JwtAuthGuard
    return this.WorkoutService.getWrokoutHistory(req.user.userId);
  }
}
