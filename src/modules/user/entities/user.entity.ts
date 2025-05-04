import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserRoles} from "../../../shared/enums/user/userRole.enum";
import {AuthProviders} from "../../../shared/enums/auth/authProvider";
import {ReviewEntity} from "../../review/entity/review.entity";
import {CommentEntity} from "../../comment/entity/comment.entity";


@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, nullable: true})
    email: string

    @Column({ nullable: true})
    password_hash: string

    @Column({
        type: "varchar",
        nullable: false,
        default: "John"
    })
    first_name: string

    @Column({
        type: "varchar",
        nullable: false,
        default: "Doe"
    })
    last_name: string

    @Column({
        type: "enum",
        enum: UserRoles,
        default: UserRoles.USER
    })
    role: UserRoles

    @Column({
        type: Boolean,
        default: false
    })
    isBlocked: boolean

    @Column({
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
    })
    avatarUrl: string

    @Column({
        type: "enum",
        enum: AuthProviders,
        default: AuthProviders.LOCAL,
    })
    provider: AuthProviders

    @Column({ nullable: true})
    provider_id: number

    @OneToMany(() => ReviewEntity, review => review.user)
    reviews: ReviewEntity

    @OneToMany(() => CommentEntity, comments => comments.author)
    comments: CommentEntity
}