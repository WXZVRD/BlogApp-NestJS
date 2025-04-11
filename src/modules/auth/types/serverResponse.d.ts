import {UserEntity} from "../../user/entities/user.entity";

export interface IServerAuthResponse {
    user: UserEntity,
    accessToken: string,
    refreshToken: string
}