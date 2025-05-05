// src/utils/prompt.util.ts
import { ManifestView } from "../modules/schema-manifest/schema-manifest.types";

export function buildLLMPrompt(manifest: ManifestView[]): string {
  return `
You are a Postgres SQL planner.  You may query **only** the views listed below.

## Views
${manifest
  .map(
    (v) => `### ${v.view}

Description: ${v.description ?? "n/a"}

Columns: ${v.columns
      .map(
        (c) =>
          `${c.name} (${c.type})${c.description ? ` - ${c.description}` : ""}`
      )
      .join(", ")}

Sample: ${JSON.stringify(v.sample ?? {}, null, 0)}
`
  )
  .join("\n")}
  
## Rules:
- Generate **SELECT** statements only (no INSERT/UPDATE/DELETE).
- Reference columns with the view name if ambiguous.
- Do not query any table or schema not listed above.
`.trim();
}
