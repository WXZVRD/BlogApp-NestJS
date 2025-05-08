import {Module} from "@nestjs/common";
import {ElasticProvider} from "./provider/elastic.provider";
import {ElasticHealthService} from "./service/elasticHealth.service";
import {ElasticSyncService} from "./service/elasticSync.service";


@Module({
    imports: [],
    providers: [
        ElasticProvider,
        ElasticHealthService,
        ElasticSyncService
    ],
    exports: [ElasticProvider]
})
export class ElasticModule{}