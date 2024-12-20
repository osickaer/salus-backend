import { GetNutrientAveragesTool } from "./tools/getNutritientAverages.tool";
import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { GetGoalsTool } from "./tools/getGoals.tool";
@Module({
  controllers: [AiController],
  providers: [AiService, GetNutrientAveragesTool, GetGoalsTool],
  exports: [AiService, GetNutrientAveragesTool, GetGoalsTool],
})
export class AiModule {}
