import {Body, Controller, Get, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {IServerAuthResponse} from "./types/serverResponse";

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
        const response = await this.authService.register(regDto);
        return response
    }

    @Post('/login')
    async login(@Body() logDto: LoginDto): Promise<IServerAuthResponse> {
        console.log("[AuthController Login]: data received: ", logDto)
        const response = await this.authService.login(logDto);
        return response;
    }
}