// src/schema-manifest/schema-manifest.module.ts
import { Module } from "@nestjs/common";
import { SchemaManifestService } from "./schema-manifest.service";
import { SchemaManifestController } from "./schema-manifest.controller";

@Module({
  providers: [SchemaManifestService],
  controllers: [SchemaManifestController], // ← add this line
  exports: [SchemaManifestService],
})
export class SchemaManifestModule {}
