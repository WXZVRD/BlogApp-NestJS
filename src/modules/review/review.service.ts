import {Injectable, NotFoundException} from "@nestjs/common";
import {ReviewCreateDto} from "./dto/review-create.dto";
import {ReviewRepository} from "./review.repository";
import {ReviewEntity} from "./entity/review.entity";
import {UserRepository} from "../user/user.repository";

interface IReviewService{
    getHello(): string

    create(reviewData: ReviewCreateDto): Promise<ReviewEntity>

    getAll(): Promise<ReviewEntity[]>

    delete(id: number): Promise<void>

    update(id: number, reviewData: ReviewEntity): Promise<void>
}

@Injectable()
export class ReviewService implements IReviewService{
    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly userRepository: UserRepository
    ) {
    }

    async create(reviewData: ReviewCreateDto): Promise<ReviewEntity> {
        const author = await this.userRepository.findById(1)
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

    getAll(): Promise<ReviewEntity[]> {
        return this.reviewRepository.getAll()
    }

    getHello(): string {
        return "Hello, World ReviewService"
    }
}