import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConsoleLogger, ValidationPipe} from "@nestjs/common";
import {SearchService} from "./modules/search/search.service";

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

  setTimeout(async () => {
    const esService = app.get(SearchService)
    await esService.ping()
  }, 1000)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
