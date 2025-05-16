import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {CommentEntity} from "./entity/comment.entity";
import {CommentCreateDto} from "./dto/comment-create.dto";
import {DeleteResult} from "typeorm";
import {AuthGuard} from "../auth/guards/auth.guard";

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
    @UseGuards(AuthGuard)
    create(@Body() commentData: CommentCreateDto): Promise<CommentEntity> {
        return this.commentService.create(commentData)
    }

    @Get()
    getAll(): Promise<CommentEntity[]> {
        return this.commentService.getAll()
    }

    @Get('/:reviewId')
    @UseGuards(AuthGuard)
    getByReview(@Param('reviewId', ParseIntPipe) reviewId: number): Promise<CommentEntity[]> {
        return this.commentService.getByReview(reviewId)
    }

    @Delete('/all')
    @UseGuards(AuthGuard)
    deleteAll(): Promise<void> {
        return this.commentService.deleteAll()
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    deleteOne(@Param() id: number): Promise<DeleteResult> {
        return this.commentService.deleteOne(id)
    }
}