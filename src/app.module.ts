import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatModule } from "./modules/chat/chat.module";
import { GoalModule } from "./modules/goal/goal.module";
import { MealModule } from "./modules/meal/meal.module";
import { OpenaiModule } from "./modules/openai/openai.module";
import { EntityModule } from "./modules/entity/entity.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { UserModule } from "./modules/user/user.module";
import mikroOrmConfig from "./mikro-orm.config"; // Import the config file

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ChatModule,
    GoalModule,
    MealModule,
    OpenaiModule,
    EntityModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
