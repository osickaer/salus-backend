import { GetNutrientAveragesTool } from "./tools/getNutritientAverages.tool";
import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { GetGoalsTool } from "./tools/getGoals.tool";
import { GetStrengthProgress } from "./tools/getStrengthProgress.tool";
import { GetLatestWorkout } from "./tools/getLatestWorkout.tool";
import { LogMealTool } from "./tools/logMeal.tool";
import { ChatGraphService } from "./graphs/chat.graph";

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    GetNutrientAveragesTool,
    GetGoalsTool,
    GetStrengthProgress,
    GetLatestWorkout,
    LogMealTool,
    ChatGraphService,
  ],
  exports: [
    AiService,
    GetNutrientAveragesTool,
    GetGoalsTool,
    GetStrengthProgress,
    GetLatestWorkout,
    LogMealTool,
    ChatGraphService,
  ],
})
export class AiModule {}
