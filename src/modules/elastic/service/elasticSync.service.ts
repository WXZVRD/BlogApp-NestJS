import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {ITypedSyncMap, ITypedTable} from "../types/map-tables.type";
import { Client } from "elasticsearch";

@Injectable()
export class ElasticSyncService implements OnModuleInit {
    private readonly logger = new Logger(ElasticSyncService.name);

    constructor(
        @Inject('ES_SYNC_MAP')
        private readonly esSyncMap: ITypedSyncMap,

        @Inject('ELASTIC_CLIENT')
        private readonly client: Client,
    ) {}

    async onModuleInit(): Promise<void> {
        for (let indice of this.esSyncMap) {
            const exists = await this.isIndiceExist(indice.tableName);

            if (!exists) {
                this.logger.log(`Index "${indice.tableName}" does not exist. Proceeding to create.`);
                await this.createIndice(indice);
            } else {
                this.logger.log(`Index "${indice.tableName}" already exists`);
            }
        }
    }

    private async isIndiceExist(indexName: string): Promise<boolean> {
        try {
            return await this.client.indices.exists({ index: indexName });
        } catch (error) {
            this.logger.error(`Failed to check if index "${indexName}" exists`, error.stack);
            throw error;
        }
    }

    private async createIndice(tableOptions: ITypedTable): Promise<void> {
        const properties = tableOptions.fields.reduce((acc, field) => {
            acc[field.name] = { type: field.type };
            return acc;
        }, {} as Record<string, any>);

        await this.client.indices.create({
            index: tableOptions.tableName,
            method: 'PUT',
            body: {
                settings: {
                    analysis: {
                        analyzer: {
                            default: {
                                type: 'standard',
                            },
                        },
                    },
                },
                mappings: {
                    properties,
                },
            },
        });

        this.logger.log(`Index "${tableOptions.tableName}" created.`);
    }
}
