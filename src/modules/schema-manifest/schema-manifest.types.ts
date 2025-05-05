// src/schema-manifest/schema-manifest.types.ts
export interface ManifestColumn {
  name: string;
  type: string;
  description: string | null;
}

export interface ManifestView {
  view: string;
  description: string | null;
  columns: ManifestColumn[];
  sample?: Record<string, unknown>;  // we’ll add this later
}
