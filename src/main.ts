import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MikroORM, RequestContext } from "@mikro-orm/core";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const orm = app.get(MikroORM);
  app.use((req, res, next) => RequestContext.create(orm.em, next));
  // const orm = app.get(MikroORM)
  // const migrator = orm.getMigrator();
  // await migrator.up();
  // const seeder = orm.getSeeder()
  // await seeder.seed(DatabaseSeeder);
  // app.useLogger(new Logger(orm.em));
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));
  // app.useGlobalFilters(new ZodFilter());
  app.enableShutdownHooks();
  // Enable CORS
  app.enableCors({
    origin: "*", // Use a specific origin in production
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  });
  // if (process.env.NODE_ENV.includes('dev')) {
  //   const config = new DocumentBuilder()
  //     .setTitle('Salus Backend API')
  //     .setDescription('Gus was here')
  //     .setVersion('0.0')
  //     .addBearerAuth()
  //     .build();
  //   const document = SwaggerModule.createDocument(app, config);
  //   SwaggerModule.setup('docs', app, document);
  // }
  await app.listen(process.env.PORT || "3000", "0.0.0.0");
}
bootstrap();
