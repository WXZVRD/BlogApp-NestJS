import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConsoleLogger, ValidationPipe} from "@nestjs/common";
import {SearchService} from "./modules/search/services/search.service";
import {ElasticHealthService} from "./modules/elastic/service/elasticHealth.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
    }),
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
