import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
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
}
