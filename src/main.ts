import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConsoleLogger, ValidationPipe} from "@nestjs/common";

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
  app.enableCors()

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
