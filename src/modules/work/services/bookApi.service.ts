    import {Injectable} from "@nestjs/common";
    import {HttpService} from "@nestjs/axios";
    import {ConfigService} from "@nestjs/config";
    import {firstValueFrom} from "rxjs";

    interface IBookApiService {
        search(query: string): Promise<any>
    }

    @Injectable()
    export class BookApiService implements IBookApiService{
        private readonly baseUrl: string

        constructor(
            private readonly httpService: HttpService,
            private readonly configService: ConfigService
        ) {
            this.baseUrl = this.configService.get<string>('BOOK_API_BASE_URL') ?? '';
        }

        async search(query: string): Promise<any> {
            const response = this.httpService.get(this.baseUrl, {
                params: {
                    q: query,
                    limit: 10
                }
            })

            const { data } = await firstValueFrom(response)

            return data.docs
            // return "sd"
        }
    }