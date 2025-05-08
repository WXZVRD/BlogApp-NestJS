import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './services/search.service';
import {ElasticModule} from "../elastic/elastic.module";

@Module({
    imports: [ElasticModule],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService]
})
export class SearchModule {}
