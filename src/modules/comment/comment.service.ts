import {Injectable, NotFoundException} from "@nestjs/common";
import {CommentEntity} from "./entity/comment.entity";
import {CommentRepository} from "./comment.repository";
import {UserRepository} from "../user/user.repository";
import {CommentCreateDto} from "./dto/comment-create.dto";
import {ReviewRepository} from "../review/repository/review.repository";
import {DeleteResult} from "typeorm";
import {ReviewEntity} from "../review/entity/review.entity";

interface ICommentService {
    getAll(): Promise<CommentEntity[]>

    getByReview(reviewId: number): Promise<CommentEntity[]>

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

    async getByReview(reviewId: number): Promise<CommentEntity[]> {
        const comments: CommentEntity[] | null = await this.commentRepository.getByReview(reviewId)
        if (!comments) {
            throw new NotFoundException("Comment to this review doesnt exist")
        }

        return comments
    }

    deleteOne(id: number): Promise<DeleteResult> {
        return this.commentRepository.delete(id)
    }

    deleteAll(): Promise<void> {
        return this.commentRepository.deleteAll()
    }

}