import {Injectable, NotFoundException} from "@nestjs/common";
import {ReviewCreateDto} from "../dto/review-create.dto";
import {ReviewRepository} from "../repository/review.repository";
import {ReviewEntity} from "../entity/review.entity";
import {UserRepository} from "../../user/user.repository";
import {LikeService} from "./like.service";
import {UserEntity} from "../../user/entities/user.entity";
import {SelectQueryBuilder} from "typeorm";
import {ReviewGetAllDto} from "../dto/review-getAll.dto";

interface IReviewService{
    getHello(): string

    create(reviewData: ReviewCreateDto): Promise<ReviewEntity>

    getAll(query: ReviewGetAllDto): Promise<ReviewEntity[]>

    getLatest(): Promise<ReviewEntity[]>

    getOne(id: number): Promise<ReviewEntity>

    delete(id: number): Promise<void>

    toggleLike(userId: number, reviewId: number): Promise<void>

    update(id: number, reviewData: ReviewEntity): Promise<void>
}

@Injectable()
export class ReviewService implements IReviewService{
    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly userRepository: UserRepository,

        private readonly likeService: LikeService,
    ) {
    }

    async create(reviewData: ReviewCreateDto): Promise<ReviewEntity> {
        const author = await this.userRepository.findById(reviewData.authorId)
        if (!author) {
            throw new NotFoundException('User not found')
        }

        const createdReview = this.reviewRepository.create(reviewData, author)

        const savedReview = await this.reviewRepository.save(createdReview)

        return savedReview
    }

    async delete(id: number): Promise<void> {
        await this.reviewRepository.delete(id)
    }

    async update(id: number, reviewData): Promise<void> {
        const result = await this.reviewRepository.update(id, reviewData)

        if (result.affected === 0) {
            throw new NotFoundException('Review not found');
        }
    }

    async toggleLike(userId: number, reviewId: number): Promise<void> {
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new NotFoundException("User was not found");
        }

        const review = await this.reviewRepository.findById(reviewId)
        if (!review) {
            throw new NotFoundException("Review was not found");
        }

        return this.likeService.toggleLike(user, review)
    }

    getAll(query: ReviewGetAllDto): Promise<ReviewEntity[]> {
        return this.reviewRepository.getAll(query)
    }

    getLatest(): Promise<ReviewEntity[]> {
        return this.reviewRepository.getLatest()
    }

    async getOne(id: number): Promise<ReviewEntity> {
        const review = await this.reviewRepository.findById(id);

        if (!review) {
            throw new NotFoundException("Review was not found");
        }

        return review;
    }

    getHello(): string {
        return "Hello, World ReviewService"
    }
}