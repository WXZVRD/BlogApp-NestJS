import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
    private client: Client;
    private readonly logger = new Logger(SearchService.name);

    constructor(
        private readonly configService: ConfigService
    ) {}

    onModuleInit() {
        const elasticUrl = this.configService.get<string>('ELASTIC_URL');
        this.client = new Client({
            host: elasticUrl,
            log: 'error',
        });

        this.logger.log('Elasticsearch client initialized.');
    }

    async ping() {
        try {
            await this.client.ping({
                requestTimeout: 30000,
            });
            this.logger.log('Easticsearch cluster is working!');
        } catch (error) {
            this.logger.error('Elasticsearch cluster is down!');
            throw new Error('Elasticsearch cluster is down!');
        }
    }
}
