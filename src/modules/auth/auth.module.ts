import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {GithubOAuthGuard} from "./guards/github-oauth.guard";
import {GithubOauthStrategy} from "./strategy/github.strategy";


@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, GithubOAuthGuard, GithubOauthStrategy],
    exports: [JwtModule]
})
export class AuthModule{}