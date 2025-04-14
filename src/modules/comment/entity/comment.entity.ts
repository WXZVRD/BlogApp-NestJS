import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";

@Entity('comments')
export class CommentEntity{
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => UserEntity, user => user.id, { onDelete: "CASCADE"})
    @JoinColumn()
    author: UserEntity

    @Column()
    content: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}