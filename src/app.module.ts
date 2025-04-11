import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {UserModule} from "./modules/user/user.module";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmConfig} from "./config/database.config";
import {AuthModule} from "./modules/auth/auth.module";
import {ReviewModule} from "./modules/review/review.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot(typeOrmConfig),
      UserModule,
      AuthModule,
      ReviewModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
