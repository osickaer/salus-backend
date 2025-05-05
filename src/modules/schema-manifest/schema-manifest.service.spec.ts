import { Test, TestingModule } from '@nestjs/testing';
import { SchemaManifestService } from './schema-manifest.service';

describe('SchemaManifestService', () => {
  let service: SchemaManifestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchemaManifestService],
    }).compile();

    service = module.get<SchemaManifestService>(SchemaManifestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
