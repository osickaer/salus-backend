import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RLSService } from "./rls.service";
import { Observable, firstValueFrom } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  constructor(private readonly rlsService: RLSService) {
    super(); // Keep this for parent class setup, but it doesn't directly cause issues
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = super.canActivate(context); // Call the parent guard's canActivate

    const isAuthenticated =
      result instanceof Observable
        ? await firstValueFrom(result) // Convert Observable to Promise
        : await result; // Await Promise<boolean> or handle boolean

    if (isAuthenticated) {
      const request = context.switchToHttp().getRequest();
      const user = request.user; // Extracted from the JWT payload

      if (!this.rlsService) {
        throw new Error("RLSService is undefined in JwtAuthGuard");
      }
      await this.rlsService.setUserSession(user.userId); // Set the RLS session variable
    }

    return isAuthenticated;
  }
}

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(private readonly rlsService: RLSService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = { userId: "test-user-id" }; // Replace with mock data
//     console.log("Mock User:", user);

//     if (this.rlsService) {
//       await this.rlsService.setUserSession(user.userId);
//     } else {
//       console.log("RLSService is still undefined.");
//     }

//     return true; // Allow access for testing
//   }
// }
