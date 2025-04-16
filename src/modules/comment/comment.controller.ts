import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {CommentEntity} from "./entity/comment.entity";
import {CommentCreateDto} from "./dto/comment-create.dto";
import {DeleteResult} from "typeorm";

interface ICommentController{
    create(commentData: CommentCreateDto): Promise<CommentEntity>

    getAll(): Promise<CommentEntity[]>

    getByReview(reviewId: number): Promise<CommentEntity[]>

    deleteAll(): Promise<void>

    deleteOne(id: number): Promise<DeleteResult>
}

@Controller('comment')
export class CommentController implements ICommentController{
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Post('/create')
    create(@Body() commentData: CommentCreateDto): Promise<CommentEntity> {
        return this.commentService.create(commentData)
    }

    @Get()
    getAll(): Promise<CommentEntity[]> {
        return this.commentService.getAll()
    }

    @Get('/:reviewId')
    getByReview(@Param('reviewId', ParseIntPipe) reviewId: number): Promise<CommentEntity[]> {
        return this.commentService.getByReview(reviewId)
    }

    @Delete('/all')
    deleteAll(): Promise<void> {
        return this.commentService.deleteAll()
    }

    @Delete(':id')
    deleteOne(@Param() id: number): Promise<DeleteResult> {
        return this.commentService.deleteOne(id)
    }
}