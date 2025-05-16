import {Injectable, NotFoundException} from "@nestjs/common";
import {ReviewCreateDto} from "../dto/review-create.dto";
import {ReviewRepository} from "../repository/review.repository";
import {ReviewEntity} from "../entity/review.entity";
import {UserRepository} from "../../user/user.repository";
import {LikeService} from "./like.service";
import {UserEntity} from "../../user/entities/user.entity";
import {SelectQueryBuilder} from "typeorm";
import {ReviewGetAllDto} from "../dto/review-getAll.dto";
import {WorkService} from "../../work/services/work.service";
import {RatingService} from "../../rating/rating.service";
import {RateTargetTypes} from "../../rating/types/rating.enum";
import {workerData} from "worker_threads";
import {ElasticCRUDService} from "../../elastic/service/elasticCRUD.service";

interface IReviewService{
    getHello(): string

    create(reviewData: ReviewCreateDto): Promise<ReviewEntity>

    getAll(query: ReviewGetAllDto): Promise<ReviewEntity[]>

    getLatest(): Promise<ReviewEntity[]>

    getMostRated(): Promise<ReviewEntity[]>

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
        private readonly workService: WorkService,
        private readonly ratingService: RatingService,

        private readonly elasticCRUDService: ElasticCRUDService
    ) {
    }

    async create(reviewData: ReviewCreateDto): Promise<ReviewEntity> {
        const author = await this.userRepository.findById(reviewData.authorId)
        if (!author) {
            throw new NotFoundException('User not found')
        }

        const createdReview = this.reviewRepository.create(reviewData, author)

        const savedReview = await this.reviewRepository.save(createdReview)


        const reviewDocument = {
            cover: savedReview.cover || 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.peakpx.com%2Fen%2Fhd-wallpaper-desktop-erezp&psig=AOvVaw13AeWdf95EEFOQaDTJXzwJ&ust=1746835376703000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNC4xISLlY0DFQAAAAAdAAAAABAE',
            title: savedReview.title,
            content: savedReview.content
        };

        await this.elasticCRUDService.createDocument(
            'review',
            savedReview.id.toString(),
            reviewDocument
        )

        await this.ratingService.rate(author.id, reviewData.workData.id, RateTargetTypes.WORK, reviewData.workData.rating);

        return savedReview
    }

    async delete(id: number): Promise<void> {
        await this.reviewRepository.delete(id)
        await this.elasticCRUDService.deleteDocument('review', id.toString())
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

    getMostRated(): Promise<ReviewEntity[]> {
        return this.reviewRepository.getMostRated()
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