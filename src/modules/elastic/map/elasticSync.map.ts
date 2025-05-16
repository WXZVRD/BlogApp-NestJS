import {ITypedSyncMap} from "../types/map-tables.type";

export const ESSyncMap: ITypedSyncMap = [
    {
        tableName: 'review',
        fields: [
            { name: 'title', type: 'text' },
            { name: 'cover', type: 'text' },
            { name: 'content', type: 'text'}
        ],
    },
];
