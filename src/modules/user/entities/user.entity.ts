import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserRoles} from "../../../shared/enums/user/userRole.enum";
import {AuthProviders} from "../../../shared/enums/auth/authProvider";


@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

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
    provider_id: string
}