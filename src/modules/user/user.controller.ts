import { UserService } from "./user.service";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { User } from "src/entities/User.entity";
import { UserBodyWeight } from "src/entities/UserBodyWeight.entity";

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

  @Get(":userId/weights/current") // Path: /user/:userId/weights/current
  async getUserCurrentWeight(
    @Param("userId") userId: string // Extract userId from path
  ): Promise<UserBodyWeight> {
    return this.UserService.getCurrentBodyWeight(userId);
  }

}
