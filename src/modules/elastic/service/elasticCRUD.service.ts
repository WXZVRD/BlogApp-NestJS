import {Inject, Injectable, Logger} from "@nestjs/common";
import { Client } from "elasticsearch";

@Injectable()
export class ElasticCRUDService {
    private readonly logger = new Logger(ElasticCRUDService.name);

    constructor(
        @Inject('ELASTIC_CLIENT')
        private readonly client: Client
    ) {}

    async createDocument(index: string, id: string, document: Record<string, any>): Promise<void> {
        try {
            await this.client.index({
                type: '_doc',
                index,
                id,
                body: document,
            });
            this.logger.log(`Document with ID "${id}" created in index "${index}".`);
        } catch (error) {
            this.logger.error(`Failed to create document in index "${index}"`, error.stack);
            throw error;
        }
    }

    async getDocument(index: string, id: string): Promise<any> {
        try {
            const response = await this.client.get({
                index,
                type: 'doc',
                id,
            });
            return response._source;
        } catch (error) {
            this.logger.error(`Failed to get document with ID "${id}" from index "${index}"`, error.stack);
            throw error;
        }
    }

    async updateDocument(index: string, id: string, update: Record<string, any>): Promise<void> {
        try {
            await this.client.update({
                type: 'doc',
                index,
                id,
                body: {
                    doc: update,
                },
            });
            this.logger.log(`Document with ID "${id}" updated in index "${index}".`);
        } catch (error) {
            this.logger.error(`Failed to update document with ID "${id}" in index "${index}"`, error.stack);
            throw error;
        }
    }

    async deleteDocument(index: string, id: string): Promise<void> {
        try {
            await this.client.delete({
                type: '_doc',
                index,
                id,
            });
            this.logger.log(`Document with ID "${id}" deleted from index "${index}".`);
        } catch (error) {
            this.logger.error(`Failed to delete document with ID "${id}" from index "${index}"`, error.stack);
            throw error;
        }
    }

    async searchDocuments(index: string, query: Record<string, any>): Promise<any> {
        try {
            const response = await this.client.search({
                index,
                body: {
                    query,
                },
            });
            return response.hits.hits;
        } catch (error) {
            this.logger.error(`Failed to search documents in index "${index}"`, error.stack);
            throw error;
        }
    }
}