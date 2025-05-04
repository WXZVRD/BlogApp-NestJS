import { Request } from 'express';
import { UserEntity } from "../../user/entities/user.entity";
import { Profile } from 'passport-github';

export type GithubRequest = Request & {
    user: {
        user?: UserEntity;
        profile: Profile;
        accessToken: string;
    };
};
