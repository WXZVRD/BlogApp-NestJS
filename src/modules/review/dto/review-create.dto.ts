import {IsNotEmpty} from "class-validator";


export class ReviewCreateDto{
    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    authorId: number
}