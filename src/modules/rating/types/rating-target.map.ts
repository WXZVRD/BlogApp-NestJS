import {RateTargetTypes} from "./rating.enum";
import {ReviewEntity} from "../../review/entity/review.entity";
import {WorkEntity} from "../../work/entity/work.entity";
import {ReviewRepository} from "../../review/repository/review.repository";
import {WorkRepository} from "../../work/repository/work.repository";

export type RateTargetMap = {
    [RateTargetTypes.REVIEW]: {
        entity: ReviewEntity;
        repo: ReviewRepository;
    };
    [RateTargetTypes.WORK]: {
        entity: WorkEntity;
        repo: WorkRepository;
    };
};

export type RateTargetType = keyof RateTargetMap;
export type RateTargetEntity<T extends RateTargetType> = RateTargetMap[T]['entity'];
export type RateTargetRepository<T extends RateTargetType> = RateTargetMap[T]['repo'];