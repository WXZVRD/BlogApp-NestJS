import {Injectable, NotFoundException} from "@nestjs/common";
import {BookApiService} from "./bookApi.service";
import {FilmApiService} from "./filmApi.service";
import {GameApiService} from "./gameApi.service";
import {WorkTypeEnum} from "../types/work.enum";
import {WorkRepository} from "../repository/work.repository";
import {IWorkFormData} from "../types/work.types";

interface IWorkService {
    search(type: WorkTypeEnum, query: string): any

    rate(workForm: IWorkFormData): Promise<any>
}

@Injectable()
export class WorkService implements IWorkService{
    constructor(
        private readonly bookApiService: BookApiService,
        private readonly filmApiService: FilmApiService,
        private readonly gameApiService: GameApiService,

        private readonly workRepository: WorkRepository
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

    async rate(workForm: IWorkFormData): Promise<any> {
        const existingWork = await this.workRepository.findById(workForm.id)
        if (!existingWork) {
            const createdWork = await this.workRepository.create(workForm)
            await this.workRepository.save(createdWork)
        }


    }
}