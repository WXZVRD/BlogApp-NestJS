import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface IFilmApiService {
    search(query: string): Promise<any>;
}

@Injectable()
export class FilmApiService implements IFilmApiService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.apiKey = this.configService.get<string>('FILM_API_ACCESS_KEY') ?? '';
        this.baseUrl = this.configService.get<string>('FILM_API_BASE_URL') ?? '';
    }

    async search(query: string): Promise<any> {
        const response = this.httpService.get(this.baseUrl, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
            params: {
                query: query,
                include_adult: false,
                language: 'en-US',
            },
        });

        const { data } = await firstValueFrom(response);
        return data.results;
    }
}
