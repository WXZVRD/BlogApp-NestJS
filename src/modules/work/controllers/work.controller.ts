import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {WorkService} from "../services/work.service";
import {WorkTypeEnum} from "../types/work.enum";
import {AuthGuard} from "../../auth/guards/auth.guard";

interface IWorkController {
    getList(type: WorkTypeEnum, query: string): any
}

@Controller('/work')
export class WorkController implements IWorkController{
    constructor(
        private readonly workService: WorkService
    ) {
    }

    @Get()
    @UseGuards(AuthGuard)
    getList(
        @Query('type') type: WorkTypeEnum,
        @Query('query') query: string
    ): any {
        return this.workService.search(type, query)
    }
}