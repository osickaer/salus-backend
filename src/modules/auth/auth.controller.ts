import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";

@Controller("auth")
export class AuthController {}
