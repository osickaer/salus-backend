import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RLSService } from "./rls.service";
import { Observable, firstValueFrom } from "rxjs";
import { RequestContext } from "@mikro-orm/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  override async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const ok = await super.canActivate(ctx); // 1 · JWT verified
    if (!ok) return false;

    const req = ctx.switchToHttp().getRequest();
    const userId = req.user.userId; // ← decoded claim

    /* 2 · Grab the EntityManager that RequestContext created in main.ts */
    const em = RequestContext.getEntityManager();

    /* 3 · Write the session variables on that very connection */
    await em.getConnection().execute("SET ROLE authenticated");
    await em
      .getConnection()
      .execute(`SET request.jwt.claim.sub = '${userId.replace(/'/g, "''")}'`);
    // optional: keep this too if you rely on it elsewhere
    // .execute(`SET jwt.claims.user_id = '${userId.replace(/'/g, "''")}'`);

    return true;
  }
}

// @Injectable()
// export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
//   constructor(private readonly rlsService: RLSService) {
//     super(); // Keep this for parent class setup, but it doesn't directly cause issues
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const result = super.canActivate(context); // Call the parent guard's canActivate

//     const isAuthenticated =
//       result instanceof Observable
//         ? await firstValueFrom(result) // Convert Observable to Promise
//         : await result; // Await Promise<boolean> or handle boolean

//     if (isAuthenticated) {
//       const request = context.switchToHttp().getRequest();
//       const user = request.user; // Extracted from the JWT payload

//       if (!this.rlsService) {
//         throw new Error("RLSService is undefined in JwtAuthGuard");
//       }
//       await this.rlsService.setUserSession(user.userId); // Set the RLS session variable
//     }

//     return isAuthenticated;
//   }
// }

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
