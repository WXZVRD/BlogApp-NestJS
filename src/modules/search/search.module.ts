import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
    imports: [
        ConfigModule
    ],
    controllers: [SearchController],
    providers: [SearchService, ConfigService],
    exports: [SearchService]
})
export class SearchModule {}
