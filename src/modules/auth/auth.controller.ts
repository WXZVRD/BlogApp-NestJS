import {Body, Controller, Get, Post, Req, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {IServerAuthResponse} from "./types/serverResponse";
import {GithubOAuthGuard} from "./guards/github-oauth.guard";
import {GithubRequest} from "./types/github-requests";

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

    @Get('github')
    @UseGuards(GithubOAuthGuard)
    async githubAuth() {
    }

    @Get('github/callback')
    @UseGuards(GithubOAuthGuard)
    async githubAuthCallback(@Req() req: GithubRequest, @Res({ passthrough: true }) res: Response) {
        const { user, profile } = req.user;

        if (!user) {
            const regUser = await this.authService.registerByGithub(profile);
            return {
                message: "Success",
                ...regUser,
            };
        }

        const tokens = await this.authService.generateJwtTokens(user);

        return {
            message: 'Success',
            user,
            ...tokens,
        };
    }
}