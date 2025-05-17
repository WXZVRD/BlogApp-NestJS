import { Controller, Get, Query, Logger } from '@nestjs/common';
import {ElasticService} from "../elastic/service/elastic.service";

@Controller('search')
export class SearchController {
    private readonly logger = new Logger(SearchController.name);

    constructor(private readonly elasticService: ElasticService) {}

    @Get()
    async search(@Query('query') query: string) {
        this.logger.debug(`Received search query: ${query}`);
        return this.elasticService.searchDocuments('review', query);
    }
}