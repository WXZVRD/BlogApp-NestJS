import {UserEntity} from "../../user/entities/user.entity";

export interface IServerAuthResponse {
    user: Partial<UserEntity>,
    accessToken: string,
    refreshToken: string
}