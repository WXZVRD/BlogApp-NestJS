import {Module} from "@nestjs/common";
import {WorkController} from "./controllers/work.controller";
import {WorkService} from "./services/work.service";
import {HttpService} from "@nestjs/axios";
import {GameApiService} from "./services/gameApi.service";
import {FilmApiService} from "./services/filmApi.service";
import {BookApiService} from "./services/bookApi.service";


@Module({
    imports: [],
    controllers: [WorkController],
    providers: [WorkService, HttpService, GameApiService, FilmApiService, BookApiService],
    exports: []
})
export class WorkModule{}