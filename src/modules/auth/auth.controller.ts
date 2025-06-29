import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    Res,
    UseGuards
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {IServerAuthResponse} from "./types/serverResponse";
import {GithubOAuthGuard} from "./guards/github-oauth.guard";
import {GithubRequest} from "./types/github-requests";
import { Response } from 'express';
import {UserEntity} from "../user/entities/user.entity";

interface IAuthController {
    getHello(): string
    register(regDto: RegisterDto): Promise<IServerAuthResponse>;
    login(logDto: LoginDto): Promise<IServerAuthResponse>;
}


@Controller('/auth')
export class AuthController implements IAuthController{
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Get()
    getHello(): string {
        return this.authService.getHello()
    }

    @Post('/register')
    async register(@Body() regDto: RegisterDto): Promise<IServerAuthResponse> {
        console.log("[AuthController Register]: data received: ", regDto)
        return await this.authService.register(regDto)
    }

    @Post('/login')
    async login(@Body() logDto: LoginDto): Promise<IServerAuthResponse> {
        console.log("[AuthController Login]: data received: ", logDto)
        return await this.authService.login(logDto);
    }

    @Get('/github')
    @UseGuards(GithubOAuthGuard)
    async githubAuth() {
    }

    @UseGuards(GithubOAuthGuard)
    @Get('/github/callback')
    async githubAuthCallback(@Req() req: GithubRequest, @Res() res: Response) {
        const { user, profile } = req.user;
        let clientUser: Partial<UserEntity> | null = null
        let tokens: {accessToken: string, refreshToken: string} | null = null;

        if (!user) {
            console.log("Юзера нету")
            const regUser = await this.authService.registerByGithub(profile);
            console.log("regUser")
            console.log(regUser)

            clientUser = {
                id: regUser?.user.id,
                email: regUser?.user.email,
                first_name: regUser?.user.first_name,
                last_name: regUser?.user.last_name,
                role: regUser?.user.role,
                avatarUrl: regUser?.user.avatarUrl,
            }

            tokens = {
                accessToken: regUser.accessToken,
                refreshToken: regUser.refreshToken,
            };
        } else {
            clientUser = {
                id: user?.id,
                email: user?.email,
                first_name: user?.first_name,
                last_name: user?.last_name,
                role: user?.role,
                avatarUrl: user?.avatarUrl,
            }

            tokens = await this.authService.generateJwtTokens(user);
        }

        const query = new URLSearchParams({
            user: JSON.stringify(clientUser),
            ...tokens
        }).toString();

        return res.redirect(`http://localhost:3001/auth/success?${query}`);
    }

    @Get('/me')
    async authMe(@Query('refreshToken') refreshToken: string): Promise<IServerAuthResponse> {
        if (!refreshToken) {
            throw new BadRequestException('Refresh token is required');
        }

        return this.authService.authMe(refreshToken);
    }
}