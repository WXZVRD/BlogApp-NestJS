import { Provider } from '@nestjs/common';
import { Client } from 'elasticsearch';
import { ConfigService } from '@nestjs/config';

export const ElasticProvider: Provider = {
    provide: 'ELASTIC_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return new Client({
            host: configService.get<string>('ELASTIC_URL'),
            log: 'error',
        });
    },
};