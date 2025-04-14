import {Controller, Get} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {CommentEntity} from "./entity/comment.entity";

interface ICommentController{

    getAll(): Promise<CommentEntity[]>
}

@Controller('comment')
export class CommentController implements ICommentController{
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Get()
    getAll(): Promise<CommentEntity[]> {
        return this.commentService.getAll()
    }
}