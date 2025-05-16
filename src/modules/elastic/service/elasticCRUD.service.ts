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

    async searchDocuments(index: string, text: string): Promise<any> {
        if (!text || !text.trim()) {
            throw new Error('Search query text is empty');
        }

        try {
            const query = {
                bool: {
                    should: [
                        {
                            match: {
                                title: {
                                    query: text,
                                    operator: 'or',
                                    fuzziness: 'auto',
                                    prefix_length: 2,
                                    boost: 3
                                }
                            }
                        },
                        {
                            match_phrase: {
                                title: {
                                    query: text,
                                    slop: 2,
                                    boost: 4
                                }
                            }
                        },
                        {
                            match: {
                                content: {
                                    query: text,
                                    operator: 'or',
                                    fuzziness: 'auto',
                                    prefix_length: 2
                                }
                            }
                        },
                        {
                            multi_match: {
                                query: text,
                                fields: ['title', 'content'],
                                type: 'bool_prefix'
                            }
                        }
                    ],
                    minimum_should_match: 1
                }
            }

            this.logger.debug(`Search query: ${JSON.stringify(query, null, 2)}`);

            const response = await this.client.search({
                index,
                body: { query }
            });

            return response.hits.hits.map(hit => hit._source);
        } catch (error) {
            this.logger.error(`Failed to search documents in index "${index}"`, error.stack);
            throw error;
        }
    }
}