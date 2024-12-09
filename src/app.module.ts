import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatModule } from "./modules/chat/chat.module";
import { GoalModule } from "./modules/goal/goal.module";
import { MealModule } from "./modules/meal/meal.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AiModule } from "./modules/ai/ai.module";
import { WorkoutModule } from "./modules/workout/workout.module";
import mikroOrmConfig from "./mikro-orm.config"; // Import the config file

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    GoalModule,
    MealModule,
    UserModule,
    AuthModule,
    ChatModule,
    AiModule,
    WorkoutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
