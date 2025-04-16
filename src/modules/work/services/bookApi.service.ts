import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";

interface IBookApiService {
    search(query: string): any
}

@Injectable()
export class BookApiService implements IBookApiService{
    constructor(
        private readonly httpService: HttpService
    ) {
    }

    search(query: string): any {
        return "Some Book work"
    }
}