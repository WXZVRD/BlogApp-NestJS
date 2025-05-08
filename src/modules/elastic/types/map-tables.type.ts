export type AllowedFieldTypes = 'number' | 'string' | 'boolean'

export interface ITypedField {
    name: string,
    type: AllowedFieldTypes
}

export interface ITypedTable {
    tableName: string,
    fields: Array<ITypedField>
}

export type ITypedSyncMap = Array<ITypedTable>