import {IsNotEmpty, MinLength} from "class-validator";


export class CommentCreateDto{
    @IsNotEmpty()
    authorId: number

    @IsNotEmpty()
    reviewId: number

    @IsNotEmpty()
    @MinLength(3)
    content: string
}