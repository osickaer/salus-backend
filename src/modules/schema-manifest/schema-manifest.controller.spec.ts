import { Test, TestingModule } from '@nestjs/testing';
import { SchemaManifestController } from './schema-manifest.controller';

describe('SchemaManifestController', () => {
  let controller: SchemaManifestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchemaManifestController],
    }).compile();

    controller = module.get<SchemaManifestController>(SchemaManifestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
