import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import {ReviewEntity} from "./review.entity";

@Entity('likes')
export class LikeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => ReviewEntity, review => review.likes,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reviewId' })
    review: ReviewEntity;

    @CreateDateColumn()
    createdAt: Date;
}