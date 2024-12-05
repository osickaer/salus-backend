import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Users } from "src/entities/Users";
import { AuthModule } from "../auth/auth.module"; // Import AuthModule

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Users] }), // Register User entity
    AuthModule, // Import AuthModule to access RLSService
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
