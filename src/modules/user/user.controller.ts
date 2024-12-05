import { UserService } from "./user.service";
import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { Users } from "src/entities/Users";
import { UserBodyWeights } from "src/entities/UserBodyWeights";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("user") // Base route: /user
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Get() // Handles GET requests to /user
  getUserHello(): string {
    return this.UserService.getGreeting();
  }

  // Fetch details for the authenticated user (removes the need for userId in params)
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getLoggedInUser(@Request() req): Promise<Users> {
    return this.UserService.getUserById(req.user.userId);
  }

  // Fetch the current weight for the authenticated user
  @UseGuards(JwtAuthGuard)
  @Get("weights/current")
  async getUserCurrentWeight(@Request() req): Promise<UserBodyWeights> {
    return this.UserService.getCurrentBodyWeight(req.user.userId);
  }
}
