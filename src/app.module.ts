import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { GoalModule } from './modules/goal/goal.module';
import { MealModule } from './modules/meal/meal.module';
import { OpenaiModule } from './modules/openai/openai.module';
import { EntityModule } from './modules/entity/entity.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      dbName: 'my-db-name.sqlite3',
      
      driver: PostgreSqlDriver,
    }),
    ChatModule, 
    GoalModule, 
    MealModule, 
    OpenaiModule, 
    EntityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
