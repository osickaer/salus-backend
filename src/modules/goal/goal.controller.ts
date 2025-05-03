import { UserGoals } from "src/entities/UserGoals";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GoalService } from "./goal.service";
import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { LogUserGoalDto } from "./dto/log-user-goal.dto";

@Controller("goal")
export class GoalController {
  constructor(private readonly GoalService: GoalService) {}

  @UseGuards(JwtAuthGuard)
  @Get("userCurrentGoal")
  async getUserGoal(@Request() req): Promise<UserGoals> {
    return this.GoalService.getUserGoal(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logUserGoal")
  async logUserGoal(
    @Request() req,
    @Body() data: LogUserGoalDto
  ): Promise<UserGoals> {
    return this.GoalService.logUserGoal(req.user.userId, data);
  }
}
