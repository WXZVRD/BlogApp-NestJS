import {IsNotEmpty} from "class-validator";
import {IWorkFormData} from "../../work/types/work.types";


export class ReviewCreateDto{
    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    authorId: number

    @IsNotEmpty()
    workData: IWorkFormData
}