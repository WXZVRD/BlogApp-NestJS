import {IsNotEmpty} from "class-validator";
import {IWorkFormData} from "../../work/types/work.types";


export class ReviewCreateDto{
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    cover: string

    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    authorId: number

    @IsNotEmpty()
    workData: IWorkFormData
}