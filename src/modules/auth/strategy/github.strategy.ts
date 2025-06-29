import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import * as GitHubStrategy from 'passport-github';
import {Profile} from 'passport-github';
import {UserRepository} from "../../user/user.repository";
import {AuthProviders} from "../../../shared/enums/auth/authProvider";

const { Strategy } = GitHubStrategy;

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        private configService: ConfigService,
        private userRepository: UserRepository,
    ) {
        super({
            clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
            clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('GITHUB_CALLBACK_URL')!,
            scope: ['user:email'],
            passReqToCallback: true,
        });
    }

    async validate(req, accessToken: string, _refreshToken: string, profile: Profile) {
        const user = await this.userRepository.findByProvider(Number(profile.id), AuthProviders.GITHUB);

        return {
            user,
            profile,
            accessToken
        };
    }
}