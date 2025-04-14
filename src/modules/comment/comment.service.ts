import {Injectable} from "@nestjs/common";
import {CommentEntity} from "./entity/comment.entity";
import {CommentRepository} from "./comment.repository";

interface ICommentService {
    getAll(): Promise<CommentEntity[]>
}

@Injectable()
export class CommentService implements ICommentService{
    constructor(
        private readonly commentRepository: CommentRepository
    ) {
    }

    getAll(): Promise<CommentEntity[]> {
        return this.commentRepository.findAll()
    }

}