import {Injectable, NotFoundException} from "@nestjs/common";
import {CommentEntity} from "./entity/comment.entity";
import {CommentRepository} from "./comment.repository";
import {UserRepository} from "../user/user.repository";
import {CommentCreateDto} from "./dto/comment-create.dto";
import {ReviewRepository} from "../review/repository/review.repository";
import {DeleteResult} from "typeorm";

interface ICommentService {
    getAll(): Promise<CommentEntity[]>

    create(commentData: CommentCreateDto): Promise<CommentEntity>

    deleteAll(): Promise<void>

    deleteOne(id: number): Promise<DeleteResult>
}

@Injectable()
export class CommentService implements ICommentService{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly reviewRepository: ReviewRepository,
        private readonly commentRepository: CommentRepository
    ) {
    }

    async create(commentData: CommentCreateDto): Promise<CommentEntity> {
        const existingUser = await this.userRepository.findById(commentData.authorId)
        if (!existingUser) {
            throw new NotFoundException('User doesnt exist')
        }

        const existingReview = await this.reviewRepository.findById(commentData.reviewId)
        if (!existingReview) {
            throw new NotFoundException('Review doesnt exist')
        }

        const createdComment = await this.commentRepository.create(commentData, existingUser, existingReview)

        return await this.commentRepository.save(createdComment)
    }

    getAll(): Promise<CommentEntity[]> {
        return this.commentRepository.findAll()
    }

    deleteOne(id: number): Promise<DeleteResult> {
        return this.commentRepository.delete(id)
    }

    deleteAll(): Promise<void> {
        return this.commentRepository.deleteAll()
    }

}