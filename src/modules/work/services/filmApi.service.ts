import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";

interface IFilmApiService {
    search(query: string): any
}

@Injectable()
export class FilmApiService implements IFilmApiService{
    constructor(
        private readonly httpService: HttpService
    ) {
    }

    search(query: string): any {
        return "Some Film work"
    }
}