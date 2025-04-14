import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import {LikeEntity} from "./like.entity";
import {CommentEntity} from "../../comment/entity/comment.entity";

@Entity('reviews')
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.reviews, { onDelete: "CASCADE" })
    user: UserEntity;

    @OneToMany(() => LikeEntity, like => like.review, { cascade: true })
    likes: LikeEntity[];

    @OneToMany(() => CommentEntity, comment => comment.review, { cascade: true })
    comments: CommentEntity[];

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}