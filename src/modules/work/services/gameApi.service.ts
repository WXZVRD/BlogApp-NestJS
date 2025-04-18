import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {lastValueFrom} from "rxjs";

interface IGameApiService {
    search(query: string): Promise<any>
}

@Injectable()
export class GameApiService implements IGameApiService{
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.apiKey = this.configService.get<string>('GAME_API_KEY') ?? '';
        this.baseUrl = this.configService.get<string>('GAME_API_BASE_URL') ?? '';
    }

    async search(query: string): Promise<any> {
        const res = await this.httpService.get(this.baseUrl, {
            params: {
                search: query,
                key: this.apiKey,
                page_size: 10
            }
        })

        const { data } = await lastValueFrom(res)

        return data.results
    }
}