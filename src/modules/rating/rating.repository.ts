import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity } from './entity/rating.entity';
import { Repository } from 'typeorm';
import {RateTargetTypes} from "./rating.enum";

@Injectable()
export class RatingRepository {
    constructor(
        @InjectRepository(RatingEntity)
        private readonly repo: Repository<RatingEntity>,
    ) {}

    async findByUserAndTarget(userId: number, targetType: RateTargetTypes, targetId: number): Promise<RatingEntity | null> {

        console.log("findByUserAndTarget userId: ", userId)
        console.log("findByUserAndTarget targetType: ", targetType)
        console.log("findByUserAndTarget targetId: ", targetId)

        return this.repo.findOne({
            where: { userId, targetType, targetId },
        });
    }

    async createRating(userId: number, targetType: RateTargetTypes, targetId: number, value: number): Promise<RatingEntity> {
        console.log("createRating userId: ", userId)
        console.log("createRating targetType: ", targetType)
        console.log("createRating targetId: ", targetId)
        return this.repo.create({ userId, targetType, targetId, value });
    }

    save(rating) {
        console.log("save rating: ", rating)
        return this.repo.save(rating);
    }

    async updateRating(rating: RatingEntity, newValue: number): Promise<RatingEntity> {
        rating.value = newValue;
        return this.repo.save(rating);
    }

    async deleteRating(rating: RatingEntity): Promise<void> {
        console.log("deleteRating targetId: ", rating)
        await this.repo.remove(rating);
    }

    async getAllRatingsForTarget(targetType: RateTargetTypes, targetId: number): Promise<RatingEntity[]> {
        return this.repo.find({ where: { targetType, targetId } });
    }

    async countRatings(targetType: RateTargetTypes, targetId: number): Promise<number> {
        return this.repo.count({ where: { targetType, targetId } });
    }

    async avgRating(targetType: string, targetId: number): Promise<number> {
        const { avg } = await this.repo
            .createQueryBuilder('rating')
            .select('AVG(rating.value)', 'avg')
            .where('rating.targetType = :targetType', { targetType })
            .andWhere('rating.targetId = :targetId', { targetId })
            .getRawOne();

        return parseFloat(avg) || 0;
    }
}
