import {Injectable, NotFoundException} from '@nestjs/common';
import {ReviewRepository} from "../review/repository/review.repository";
import {RatingRepository} from "./rating.repository";
import {RatingEntity} from "./entity/rating.entity";
import {ReviewEntity} from "../review/entity/review.entity";
import {RateTargetTypes} from "./rating.enum";

interface IRatingService {
    rate(userId: number, targetType: 'work' | 'review', targetId: number, newValue: number)

    delete(userId: number, targetType: 'work' | 'review', targetId: number)
}

@Injectable()
export class RatingService implements IRatingService{
    constructor(
        private ratingRepository: RatingRepository,
        private reviewRepository: ReviewRepository,
    ) {}

    private getTargetRepo(targetType: RateTargetTypes): ReviewRepository {
        switch (targetType) {
            case RateTargetTypes.REVIEW: return this.reviewRepository;
            case RateTargetTypes.WORK: return this.reviewRepository;
            default: throw new NotFoundException('Unknown target type');
        }
    }

    async rate(userId: number, targetType: RateTargetTypes, targetId: number, newValue: number) {
        const repo: ReviewRepository = this.getTargetRepo(targetType);
        const target: ReviewEntity | null = await repo.findById(targetId);
        if (!target) throw new NotFoundException(`${targetType} not found`);

        const existing: RatingEntity | null = await this.ratingRepository.findByUserAndTarget(userId, targetType, targetId);

        if (!existing) {
            const rating: RatingEntity = await this.ratingRepository.createRating(userId, targetType, targetId, newValue);
            await this.ratingRepository.save(rating)

            target.averageRating = (target.averageRating * target.ratingCount + newValue) / (target.ratingCount + 1);
            target.ratingCount += 1;
        } else {
            const oldValue = existing.value;
            existing.value = newValue;
            await this.ratingRepository.save(existing);

            target.averageRating = (target.averageRating * target.ratingCount - oldValue + newValue) / target.ratingCount;
        }

        await repo.save(target);
        return target;
    }

    async delete(userId: number, targetType: RateTargetTypes, targetId: number) {
        const rating: RatingEntity | null = await this.ratingRepository.findByUserAndTarget(userId, targetType, targetId);
        if (!rating) return;

        const repo = this.getTargetRepo(targetType);
        const target = await repo.findById(targetId);
        if (!target) return;

        const oldValue = rating.value;
        await this.ratingRepository.deleteRating(rating);

        if (target.ratingCount <= 1) {
            target.averageRating = 0;
            target.ratingCount = 0;
        } else {
            target.averageRating = (target.averageRating * target.ratingCount - oldValue) / (target.ratingCount - 1);
            target.ratingCount -= 1;
        }

        await repo.save(target);
    }
}
