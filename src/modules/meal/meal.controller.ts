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
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MealService } from "./meal.service";
import { Meals } from "src/entities/Meals";

@Controller("meal")
export class MealController {
  constructor(private readonly MealService: MealService) {}

  @UseGuards(JwtAuthGuard)
  @Get("mealHistory")
  async getMeals(@Request() req): Promise<Partial<Meals>[]> {
    // Use userId from the JWT payload attached by JwtAuthGuard
    return this.MealService.getMealHistory(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":mealId/mealDetail")
  async getMealDetail(
    @Request() req,
    @Param("mealId") mealId: string
  ): Promise<Meals> {
    // Use userId from the JWT payload attached by JwtAuthGuard
    return this.MealService.getMealDetail(req.user.userId, mealId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logMeal")
  async logMeal(
    @Request() req,
    @Body()
    body: { timestamp: string; foodDescription: string; mealType?: string }
  ): Promise<string> {
    const userId = req.user.userId;
    const { timestamp, foodDescription, mealType } = body;

    if (!foodDescription) {
      throw new BadRequestException("Food description is required.");
    }

    return this.MealService.logMeal(
      userId,
      foodDescription,
      timestamp,
      mealType ?? null
    );
  }
}
