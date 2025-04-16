import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {RateTargetTypes} from "../rating.enum";


@Entity('ratings')
export class RatingEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column({ type: "float", default: 0 })
    value: number

    @Column()
    targetType: RateTargetTypes

    @Column()
    targetId: number;
}