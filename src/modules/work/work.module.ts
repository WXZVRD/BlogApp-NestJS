import {Module} from "@nestjs/common";
import {WorkController} from "./controllers/work.controller";
import {WorkService} from "./services/work.service";
import {HttpModule} from "@nestjs/axios";
import {GameApiService} from "./services/gameApi.service";
import {FilmApiService} from "./services/filmApi.service";
import {BookApiService} from "./services/bookApi.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {WorkEntity} from "./entity/work.entity";
import {WorkRepository} from "./repository/work.repository";


@Module({
    imports: [
        TypeOrmModule.forFeature([WorkEntity]),
        HttpModule
    ],
    controllers: [WorkController],
    providers: [WorkService, GameApiService, FilmApiService, BookApiService, WorkRepository],
    exports: [WorkRepository, WorkService]
})
export class WorkModule{}