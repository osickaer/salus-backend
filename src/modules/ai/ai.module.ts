import { GetNutrientAveragesTool } from "./tools/getNutritientAverages.tool";
import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { GetGoalsTool } from "./tools/getGoals.tool";
import { GetStrengthProgress } from "./tools/getStrengthProgress.tool";
import { GetLatestWorkout } from "./tools/getLatestWorkout.tool";
@Module({
  controllers: [AiController],
  providers: [
    AiService,
    GetNutrientAveragesTool,
    GetGoalsTool,
    GetStrengthProgress,
    GetLatestWorkout,
  ],
  exports: [
    AiService,
    GetNutrientAveragesTool,
    GetGoalsTool,
    GetStrengthProgress,
    GetLatestWorkout,
  ],
})
export class AiModule {}
