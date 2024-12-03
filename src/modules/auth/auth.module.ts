import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { RLSService } from "./rls.service";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("SUPABASE_JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  providers: [
    JwtStrategy, // Handles JWT validation
    RLSService, // Handles setting the PostgreSQL session variable
  ],
  exports: [
    JwtModule,
    PassportModule,
    RLSService, // Makes RLSService available to other modules
  ],
})
export class AuthModule {}
