import {ITypedSyncMap} from "../types/map-tables.type";

export const ESSyncMap: ITypedSyncMap = [
    {
        tableName: 'review',
        fields: [
            { name: 'id', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'cover', type: 'text'},
            { name: 'content', type: 'text'},
            { name: 'averageRating', type: 'text'},
            { name: 'createdAt', type: 'text'},
        ],
    },
];
