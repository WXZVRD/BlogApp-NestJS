import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;
    private readonly logger = new Logger(RedisService.name);

    constructor(private readonly configService: ConfigService) {}

    onModuleInit(): void {
        this.client = new Redis({
            host: this.configService.get<string>("REDIS_HOST", "localhost"),
            port: this.configService.get<number>("REDIS_PORT", 6379),
            password: this.configService.get<string>("REDIS_PASSWORD"),
        });

        this.client.on("connect", () => this.logger.log("Redis client is connecting..."));
        this.client.on("ready", () => this.logger.log("Redis client connected and ready."));
        this.client.on("error", (err) => this.logger.error("Redis error: " + err.message));
        this.client.on("close", () => this.logger.warn("Redis connection closed."));
        this.client.on("reconnecting", () => this.logger.log("Redis is reconnecting..."));
    }

    getClient(): Redis {
        return this.client;
    }

    async set(key: string, value: any, ttlInSeconds?: number): Promise<void> {
        const stringified = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttlInSeconds) {
            await this.client.set(key, stringified, 'EX', ttlInSeconds);
        } else {
            await this.client.set(key, stringified);
        }
    }

    async get<T = any>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async onModuleDestroy(): Promise<void> {
        this.logger.log("Disconnecting from Redis...");
        await this.client.quit();
        this.logger.log("Redis client disconnected.");
    }
}