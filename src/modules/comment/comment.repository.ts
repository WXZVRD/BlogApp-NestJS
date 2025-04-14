import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity} from "./entity/comment.entity";
import {Repository} from "typeorm";


@Injectable()
export class CommentRepository{
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>
    ) {
    }

    findAll(): Promise<CommentEntity[]> {
        return this.commentRepository.find()
    }
}