import { Module } from "@nestjs/common";
import { MealController } from "./meal.controller";
import { MealService } from "./meal.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule, // Import AuthModule to provide RLSService
  ],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
