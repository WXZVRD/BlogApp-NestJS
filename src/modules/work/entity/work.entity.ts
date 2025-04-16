import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {WorkTypeEnum} from "../types/work.enum";


@Entity('works')
export class WorkEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ nullable: true })
    avatar: string

    @Column({
        type: "enum",
        enum: WorkTypeEnum,
        default: WorkTypeEnum.GAME
    })
    workType: WorkTypeEnum

    @Column({ type: "float", default: 0 })
    averageRating: number;

    @Column({ type: "int", default: 0 })
    ratingCount: number;
}