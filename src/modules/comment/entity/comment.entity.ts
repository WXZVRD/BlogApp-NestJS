import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {ReviewEntity} from "../../review/entity/review.entity";

@Entity('comments')
export class CommentEntity{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => UserEntity, user => user.comments, { onDelete: "CASCADE" })
    @JoinColumn()
    author: UserEntity;

    @ManyToOne(() => ReviewEntity, review => review.comments, { onDelete: "CASCADE" })
    review: ReviewEntity;

    @Column()
    content: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}