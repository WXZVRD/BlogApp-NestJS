import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity} from "./entity/comment.entity";
import {Repository} from "typeorm";
import {CommentCreateDto} from "./dto/comment-create.dto";
import {UserEntity} from "../user/entities/user.entity";
import {ReviewEntity} from "../review/entity/review.entity";


@Injectable()
export class CommentRepository{
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>
    ) {
    }

    create(commentData: CommentCreateDto, user: UserEntity, review: ReviewEntity): CommentEntity{
        return this.commentRepository.create({
            content: commentData.content,
            author: user,
            review: review
        })
    }

    async save(comment: CommentEntity) {
        return this.commentRepository.save(comment)
    }

    findAll(): Promise<CommentEntity[]> {
        return this.commentRepository.find({
            relations: ['author']
        })
    }

    delete(id: number) {
        return this.commentRepository.delete(id)
    }

    deleteAll() {
        return this.commentRepository.clear()
    }
}