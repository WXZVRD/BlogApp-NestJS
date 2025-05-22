import {Module} from "@nestjs/common";
import {ElasticSyncService} from "./service/elasticSync.service";
import {ElasticSyncMapProvider} from "./provider/elasticSyncMap.provider";
import {ElasticService} from "./service/elastic.service";


@Module({
    imports: [],
    providers: [
        ElasticSyncService,
        ElasticSyncMapProvider,
        ElasticService
    ],
    exports: [ElasticService]
})
export class ElasticModule{}