import { UserService } from "./user.service";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { User } from "src/entities/User.entity";
import { UserBodyWeights } from "src/entities/UserBodyWeights.entity";

@Controller("user") // Base route: /user
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Get() // Handles GET requests to /user
  getUserHello(): string {
    return this.UserService.getGreeting();
  }

  @Get(":userId") // Handles GET requests to /users/:id
  async getUser(@Param("userId") userId: string): Promise<User> {
    return this.UserService.getUserById(userId);
  }

  @Get("weights/current") // Matches /user/weights/current
  async getUserCurrentWeight(
    @Query("userId") userId: string // Extracts userId from query string
  ): Promise<UserBodyWeights> {
    return this.UserService.getCurrentBodyWeight(userId);
  }
}
