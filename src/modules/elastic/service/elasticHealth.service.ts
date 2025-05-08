import {Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import { Client } from 'elasticsearch';

@Injectable()
export class ElasticHealthService implements OnModuleInit{
    private readonly logger = new Logger(ElasticHealthService.name);

    constructor(
        @Inject('ELASTIC_CLIENT')
        private readonly client: Client,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.ping()
    }

    async ping(): Promise<void> {
        try {
            await this.client.ping({ requestTimeout: 3000 });
            this.logger.log('Elasticsearch cluster is UP');
        } catch (error) {
            this.logger.error('Elasticsearch cluster is DOWN');
            throw error;
        }
    }
}