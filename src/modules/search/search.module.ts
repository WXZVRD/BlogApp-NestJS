import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import {ElasticModule} from "../elastic/elastic.module";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [ElasticModule, AuthModule],
    controllers: [SearchController],
})
export class SearchModule {}
