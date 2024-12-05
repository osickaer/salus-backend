import { UserGoals } from "src/entities/UserGoals";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GoalService } from "./goal.service";
import { Controller, Request, Get, UseGuards } from "@nestjs/common";

@Controller("goal")
export class GoalController {
  constructor(private readonly GoalService: GoalService) {}

  @UseGuards(JwtAuthGuard)
  @Get("userGoal")
  async getUserGoal(@Request() req): Promise<UserGoals> {
    return this.GoalService.getUserGoal(req.user.userId);
  }
}
