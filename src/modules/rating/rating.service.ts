import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from "../review/repository/review.repository";
import { RatingRepository } from "./repository/rating.repository";
import { RatingEntity } from "./entity/rating.entity";
import { WorkRepository } from "../work/repository/work.repository";
import {
    RateTargetRepository,
    RateTargetType
} from "./types/rating-target.map";
import { RateTargetTypes } from "./types/rating.enum";

@Injectable()
export class RatingService {
    private readonly logger = new Logger(RatingService.name);

    constructor(
        private ratingRepository: RatingRepository,
        private reviewRepository: ReviewRepository,
        private workRepository: WorkRepository,
    ) {}

    async rate<T extends RateTargetType>(
        userId: number,
        targetId: number,
        targetType: T,
        value: number
    ): Promise<void> {
        this.logger.debug(`rate() called with userId=${userId}, targetId=${targetId}, targetType=${targetType}, value=${value}`);
        await this.updateRating(userId, targetId, targetType, value);
        await this.calculateAverageRating(targetId, targetType);
    }

    private getTargetRepo<T extends RateTargetType>(targetType: T): RateTargetRepository<T> {
        this.logger.debug(`getTargetRepo() for targetType=${targetType}`);
        switch (targetType) {
            case RateTargetTypes.REVIEW:
                return this.reviewRepository as RateTargetRepository<T>;
            case RateTargetTypes.WORK:
                return this.workRepository as RateTargetRepository<T>;
            default:
                this.logger.error(`Unknown targetType=${targetType}`);
                throw new NotFoundException('Unknown target type');
        }
    }

    private async updateRating<T extends RateTargetType>(
        userId: number,
        targetId: number,
        targetType: T,
        value: number
    ): Promise<RatingEntity> {
        this.logger.debug(`updateRating() - Checking existing rating for userId=${userId}, targetId=${targetId}, targetType=${targetType}`);
        const existing = await this.ratingRepository.findByUserAndTarget({ userId, targetId, targetType });

        if (existing) {
            this.logger.debug(`updateRating() - Found existing rating. Updating value to ${value}`);
            existing.value = value;
            const updated = await this.ratingRepository.save(existing);
            this.logger.debug(`updateRating() - Saved updated rating: ${JSON.stringify(updated)}`);
            return updated;
        }

        this.logger.debug(`updateRating() - No existing rating found. Creating new rating`);
        const newRating = await this.ratingRepository.create(userId, targetType, targetId, value);
        this.logger.debug(`updateRating() - Created new rating object: ${JSON.stringify(newRating)}`);
        console.log(newRating)
        const saved = await this.ratingRepository.save(newRating);
        this.logger.debug(`updateRating() - Saved new rating: ${JSON.stringify(saved)}`);
        return saved;
    }

    private async calculateAverageRating<T extends RateTargetType>(
        targetId: number,
        targetType: T
    ): Promise<{ averageRating: number, ratingCount: number }> {
        this.logger.debug(`calculateAverageRating() - Calculating average for targetId=${targetId}, targetType=${targetType}`);
        const ratings = await this.ratingRepository.findAllByTarget(targetId, targetType);

        if (!ratings || ratings.length === 0) {
            this.logger.warn(`calculateAverageRating() - No ratings found for targetId=${targetId}, targetType=${targetType}`);
            throw new NotFoundException("No ratings to this target");
        }

        const ratingCount = ratings.length;
        const sum = ratings.reduce((acc, curr) => acc + curr.value, 0);
        const averageRating = ratingCount > 0 ? sum / ratingCount : 0;

        this.logger.debug(`calculateAverageRating() - Computed average=${averageRating}, count=${ratingCount}`);

        const repo: RateTargetRepository<RateTargetType> = this.getTargetRepo(targetType);
        await repo.updateRating(targetId, averageRating, ratingCount);

        this.logger.debug(`calculateAverageRating() - Updated target entity with new average and count`);

        return { averageRating, ratingCount };
    }
}