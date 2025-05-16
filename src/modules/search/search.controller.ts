import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ElasticCRUDService } from '../elastic/service/elasticCRUD.service';

@Controller('search')
export class SearchController {
    private readonly logger = new Logger(SearchController.name);

    constructor(private readonly elasticCRUDservice: ElasticCRUDService) {}

    @Get()
    async search(@Query('query') query: string) {
        this.logger.debug(`Received search query: ${query}`);
        return this.elasticCRUDservice.searchDocuments('review', query);
    }
}