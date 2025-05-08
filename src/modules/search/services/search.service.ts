import {Inject, Injectable, Logger} from '@nestjs/common';
import { Client } from 'elasticsearch';

@Injectable()
export class SearchService {
    private readonly logger = new Logger(SearchService.name);

    constructor(
        @Inject('ELASTIC_CLIENT')
        private readonly esClient: Client,
    ) {}
}
