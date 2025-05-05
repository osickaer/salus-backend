// src/schema-manifest/schema-manifest.controller.ts
import { Controller, Get, Header, Res } from "@nestjs/common";
import { SchemaManifestService } from "./schema-manifest.service";
import { buildLLMPrompt } from "../../utils/prompt.util";

@Controller("manifest")
export class SchemaManifestController {
  constructor(private readonly manifestSvc: SchemaManifestService) {}

  // existing /manifest  → raw JSON
  @Get()
  async getManifest() {
    return this.manifestSvc.get();
  }

  // NEW: /manifest/prompt  → plain‑text prompt
  @Get("prompt")
  @Header("Content-Type", "text/plain; charset=utf-8") // 👈 key line
  async getPrompt(): Promise<string> {
    const manifest = await this.manifestSvc.get();
    return buildLLMPrompt(manifest); // already contains \n
  }

  /* optional variant that uses the Response object
  @Get('prompt')
  async getPrompt(@Res() res: Response) {
    const manifest = await this.manifestSvc.get();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(buildLLMPrompt(manifest));
  }
  */
}
