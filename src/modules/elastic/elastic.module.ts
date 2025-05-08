import {Logger, Module} from "@nestjs/common";
import {ElasticProvider} from "./provider/elastic.provider";
import {ElasticHealthService} from "./service/elasticHealth.service";
import {ElasticSyncService} from "./service/elasticSync.service";
import {ElasticSyncMapProvider} from "./provider/elasticSyncMap.provider";


@Module({
    imports: [],
    providers: [
        ElasticProvider,
        ElasticHealthService,
        ElasticSyncService,
        ElasticSyncMapProvider
    ],
    exports: [ElasticProvider]
})
export class ElasticModule{}