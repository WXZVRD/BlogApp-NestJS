import {Provider} from "@nestjs/common";
import {ESSyncMap} from "../map/elasticSync.map";


export const ElasticSyncMapProvider: Provider = {
    provide: 'ES_SYNC_MAP',
    useValue: ESSyncMap
}