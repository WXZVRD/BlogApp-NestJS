import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";

interface IGameApiService {
    search(query: string): any
}

@Injectable()
export class GameApiService implements IGameApiService{
    constructor(
        private readonly httpService: HttpService
    ) {
    }

    search(query: string): any {
        return "Some Game work"
    }
}