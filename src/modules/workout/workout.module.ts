import { Module } from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { WorkoutController } from "./workout.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule, // Import AuthModule to provide RLSService
  ],
  providers: [WorkoutService],
  controllers: [WorkoutController],
})
export class WorkoutModule {}
