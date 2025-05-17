import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis, {Result} from "ioredis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;
    private readonly logger = new Logger(RedisService.name);

    constructor(private readonly configService: ConfigService) {}

    onModuleInit(): void {
        this.client = new Redis({
            host: this.configService.get<string>("REDIS_URL", 'localhost'),
            port: this.configService.get<number>("REDIS_PORT", 6379),
            password: this.configService.get<string>("REDIS_PASSWORD")
        });

        this.client.on("connect", () => {
            this.logger.log("Redis client is connecting...");
        });

        this.client.on("ready", () => {
            this.logger.log("Redis client connected and ready.");
        });

        this.client.on("error", (err) => {
            this.logger.error("Redis error: " + err.message);
        });

        this.client.on("close", () => {
            this.logger.warn("Redis connection closed.");
        });

        this.client.on("reconnecting", () => {
            this.logger.log("Redis is reconnecting...");
        });
    }

    getClient(): Redis {
        return this.client;
    }

    set(key: string, value: any) {
        this.client.set(key, value)
    }

    get(key: string): Result<any, any> {
        return this.client.get(key)
    }

    async onModuleDestroy(): Promise<void> {
        this.logger.log("Disconnecting from Redis...");
        await this.client.quit();
        this.logger.log("Redis client disconnected.");
    }
}
