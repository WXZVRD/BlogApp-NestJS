import {Injectable, NotFoundException} from "@nestjs/common";
import {BookApiService} from "./bookApi.service";
import {FilmApiService} from "./filmApi.service";
import {GameApiService} from "./gameApi.service";
import {WorkTypeEnum} from "../types/work.enum";

interface IWorkService {
    search(type: WorkTypeEnum, query: string): any
}

@Injectable()
export class WorkService implements IWorkService{
    constructor(
        private readonly bookApiService: BookApiService,
        private readonly filmApiService: FilmApiService,
        private readonly gameApiService: GameApiService
    ) {
    }

    search(type: WorkTypeEnum, query: string): any {
        switch (type) {
            case WorkTypeEnum.BOOK:
                return this.bookApiService.search(query)
            case WorkTypeEnum.GAME:
                return this.gameApiService.search(query)
            case WorkTypeEnum.FILM:
                return this.filmApiService.search(query)
            default:
                throw new Error('Unsupported type');
        }
    }
}