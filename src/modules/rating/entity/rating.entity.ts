import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {RateTargetTypes} from "../types/rating.enum";


@Entity('ratings')
export class RatingEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column({ type: "float", default: 0 })
    value: number

    @Column({ type: 'enum', enum: RateTargetTypes })
    targetType: RateTargetTypes;

    @Column()
    targetId: number;
}