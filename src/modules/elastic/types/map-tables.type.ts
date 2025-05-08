export type ESFieldType = 'text' | 'keyword' | 'integer' | 'boolean' | 'date';

export interface ITypedField {
    name: string;
    type: ESFieldType;
}

export interface ITypedTable {
    tableName: string;
    fields: ITypedField[];
}

export type ITypedSyncMap = ITypedTable[];
