// src/schema-manifest/schema-manifest.service.ts
import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { readFileSync } from "fs";
import { ManifestView } from "./schema-manifest.types";

@Injectable()
export class SchemaManifestService {
  private readonly manifestSql = readFileSync(
    "src/modules/schema-manifest/manifest.sql",
    "utf8"
  );

  /** simple in‑memory cache (cleared on app restart) */
  private manifestCache: ManifestView[] | null = null;

  constructor(private readonly em: EntityManager) {}

  /** rebuild manifest and refresh in‑memory cache */
  async regenerate(): Promise<ManifestView[]> {
    const [{ manifest }] = await this.em
      .getConnection()
      .execute<{ manifest: ManifestView[] }[]>(this.manifestSql);

    // attach a single sample row (optional)
    for (const entry of manifest) {
      try {
        const [sample] = await this.em
          .getConnection()
          .execute<Record<string, unknown>[]>(
            `select row_to_json(t) as row
               from (select * from llm_views."${entry.view}" limit 1) t`
          );
        entry.sample = sample?.row as Record<string, unknown>;
      } catch {
        /* RLS might hide rows – ignore */
      }
    }

    this.manifestCache = manifest; // ← store in memory
    return manifest;
  }

  /** get cached manifest (rebuild on first call) */
  async get(): Promise<ManifestView[]> {
    if (!this.manifestCache) {
      await this.regenerate(); // first hit → build once
    }
    return this.manifestCache!;
  }
}
