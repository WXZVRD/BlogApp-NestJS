import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {ReviewCreateDto} from "../dto/review-create.dto";
import {ReviewRepository} from "../repository/review.repository";
import {ReviewEntity} from "../entity/review.entity";
import {UserRepository} from "../../user/user.repository";
import {LikeService} from "./like.service";
import {ReviewGetAllDto} from "../dto/review-getAll.dto";
import {WorkService} from "../../work/services/work.service";
import {RatingService} from "../../rating/rating.service";
import {RateTargetTypes} from "../../rating/types/rating.enum";
import {ElasticService} from "../../elastic/service/elastic.service";
import {RedisService} from "../../redis/redis.service";

interface IReviewService{
    getHello(): string
    create(reviewData: ReviewCreateDto): Promise<ReviewEntity>
    search(query: ReviewGetAllDto): Promise<{ data: ReviewEntity[]; total: number }>
    getLatest(): Promise<ReviewEntity[]>
    getMostRated(): Promise<ReviewEntity[]>
    getOne(id: number): Promise<ReviewEntity>
    delete(id: number): Promise<void>
    toggleLike(userId: number, reviewId: number): Promise<void>
    update(id: number, reviewData: ReviewEntity): Promise<void>
    getByAuthor(authorId: number): Promise<ReviewEntity[]>
}

@Injectable()
export class ReviewService implements IReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly userRepository: UserRepository,
        private readonly likeService: LikeService,
        private readonly workService: WorkService,
        private readonly ratingService: RatingService,
        private readonly redisService: RedisService,
        private readonly elasticService: ElasticService,
    ) {}

    async create(reviewData: ReviewCreateDto): Promise<ReviewEntity> {
        try {
            console.log("🚀 Начало создания рецензии:", reviewData);

            const author = await this.userRepository.findById(reviewData.authorId);
            if (!author) {
                console.warn("⚠️ Пользователь не найден по ID:", reviewData.authorId);
                throw new NotFoundException('User not found');
            }
            console.log("👤 Найден автор:", author);

            const createdReview = this.reviewRepository.create(reviewData, author);
            console.log("🛠️ Создана рецензия (до сохранения):", createdReview);

            const savedReview = await this.reviewRepository.save(createdReview);
            console.log("💾 Рецензия сохранена в БД:", savedReview);

            const reviewDocument = {
                id: savedReview.id,
                title: savedReview.title,
                cover:
                    savedReview.cover ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNr62PA6NV5OxD8VoMyVnSQs-e9_nalSC-kg&s',
                content: savedReview.content,
                averageRating: savedReview.averageRating,
                createdAt: savedReview.createdAt,
            };
            console.log("📄 Документ для Elasticsearch:", reviewDocument);

            await this.elasticService.createDocument(
                'review',
                savedReview.id.toString(),
                reviewDocument,
            );
            console.log("🔍 Документ добавлен в Elasticsearch");

            await this.ratingService.rate(
                author.id,
                reviewData.workData.id,
                RateTargetTypes.WORK,
                reviewData.workData.rating,
            );
            console.log("⭐ Поставлен рейтинг работе:", {
                userId: author.id,
                workId: reviewData.workData.id,
                rating: reviewData.workData.rating,
            });

            return savedReview;
        } catch (error) {
            console.error("❌ Ошибка при создании рецензии:", error);
            throw new InternalServerErrorException('Failed to create review');
        }
    }


    async getByAuthor(authorId: number): Promise<ReviewEntity[]> {
        const author = await this.userRepository.findById(authorId);
        if (!author) {
            throw new NotFoundException("Author not found");
        }

        return this.reviewRepository.findByAuthorId(authorId);
    }

    async search(query: ReviewGetAllDto): Promise<{ data: ReviewEntity[]; total: number }> {
        const { page = 1, take = 10 } = query;
        const skip = (page - 1) * take;

        return this.reviewRepository.findAndCount(skip, take);
    }

    async delete(id: number): Promise<void> {
        await this.reviewRepository.delete(id)
        await this.elasticService.deleteDocument('review', id.toString())
    }

    async update(id: number, reviewData: Partial<ReviewEntity>): Promise<void> {
        const result = await this.reviewRepository.update(id, reviewData);
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

    async getLatest(): Promise<ReviewEntity[]> {
        const cacheKey = "review:latest";

        const cachedLatestReview = await this.redisService.get<ReviewEntity[]>(cacheKey);
        if (cachedLatestReview) {
            console.log("Cache hit: returning cached latest reviews.");
            return cachedLatestReview;
        }

        console.log("Cache miss: fetching latest reviews from database...");
        const latestReviews = await this.reviewRepository.getLatest();

        if (!latestReviews || latestReviews.length === 0) {
            console.warn("No latest reviews found in database.");
            return [];
        }

        await this.redisService.set(cacheKey, latestReviews, 5);
        console.log("Latest reviews cached successfully.");

        return latestReviews;
    }

    async getMostRated(): Promise<ReviewEntity[]> {
        const cacheKey = "review:rated";

        const cachedRatedReview = await this.redisService.get<ReviewEntity[]>(cacheKey);
        if (cachedRatedReview) {
            console.log("Cache hit: returning cached most rated reviews.");
            return cachedRatedReview;
        }

        console.log("Cache miss: fetching most rated reviews from database...");
        const mostRatedReview = await this.reviewRepository.getMostRated();

        if (!mostRatedReview || mostRatedReview.length === 0) {
            console.warn("No most rated reviews found in database.");
            throw new NotFoundException('Most rated reviews not found');
        }

        await this.redisService.set(cacheKey, mostRatedReview, 5);
        console.log("Most rated reviews cached successfully.");

        return mostRatedReview;
    }

    async getOne(id: number): Promise<ReviewEntity> {
        console.log(`🔎 Поиск рецензии с ID: ${id}`);

        const review = await this.reviewRepository.findById(id);

        if (!review) {
            console.warn(`⚠️ Рецензия с ID ${id} не найдена`);
            throw new NotFoundException("Review was not found");
        }

        console.log(`✅ Рецензия найдена: ${JSON.stringify(review, null, 2)}`);

        return review;
    }

    getHello(): string {
        return "Hello, World ReviewService"
    }
}