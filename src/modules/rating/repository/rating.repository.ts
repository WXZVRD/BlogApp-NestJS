import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity } from '../entity/rating.entity';
import { Repository } from 'typeorm';
import {RateTargetTypes} from "../types/rating.enum";

@Injectable()
export class RatingRepository {
    constructor(
        @InjectRepository(RatingEntity)
        private readonly repo: Repository<RatingEntity>,
    ) {}

    async findByUserAndTarget(params: {
        userId: number;
        targetId: number;
        targetType: RateTargetTypes;
    }): Promise<RatingEntity | null> {
        const { userId, targetId, targetType } = params;

        return this.repo.findOne({
            where: { userId, targetId, targetType }
        });
    }

    async create(userId: number, targetType: RateTargetTypes, targetId: number, value: number): Promise<RatingEntity> {
        return this.repo.create({ userId, targetType, targetId, value });
    }

    async findAllByTarget(targetId: number, targetType: RateTargetTypes): Promise<RatingEntity[] | null> {
        return await this.repo.find({
            where: { targetId, targetType }
        })
    }

    save(rating){
        return this.repo.save(rating) as Promise<RatingEntity>;
    }
}
