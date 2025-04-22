import {WorkTypeEnum} from "./work.enum";


export interface IWorkFormData {
    id: number
    title: string
    cover: string
    type: WorkTypeEnum
    rating: number
}