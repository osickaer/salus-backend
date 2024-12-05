import { Module } from "@nestjs/common";
import { GoalController } from "./goal.controller";
import { GoalService } from "./goal.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule, // Import AuthModule to provide RLSService
  ],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
