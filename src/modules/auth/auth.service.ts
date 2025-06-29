import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {RegisterDto} from "./dto/register.dto";
import {UserRepository} from "../user/user.repository";
import * as bcrypt from 'bcryptjs';
import {UserEntity} from "../user/entities/user.entity";
import {LoginDto} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";
import {IServerAuthResponse} from "./types/serverResponse";
import {Profile} from "passport-github";
import {AuthProviders} from "../../shared/enums/auth/authProvider";

interface IAuthService {
    getHello(): string
    register(regDto: RegisterDto): Promise<IServerAuthResponse>
    login(logDto: LoginDto): Promise<IServerAuthResponse>

    generateJwtTokens(user: UserEntity): Promise<{ accessToken: string; refreshToken: string }>
}

@Injectable()
export class AuthService implements IAuthService{
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository
    ) {
    }

    getHello(): string {
        return "Hello, World by AuthService"
    }

    async register(regDto: RegisterDto): Promise<IServerAuthResponse> {
        const existingUser = await this.userRepository.findByEmail(regDto.email)
        if (existingUser) {
            throw new ConflictException("email already exist")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(regDto.password, salt)

        const createdUser = this.userRepository.createByLocal({
            email: regDto.email,
            password_hash: hashedPassword,
            first_name: regDto.firstName,
            last_name: regDto.lastName
        })

        const savedUser = await this.userRepository.save(createdUser)

        const clientUser: Partial<UserEntity> = {
            id: savedUser.id,
            email: savedUser.email,
            first_name: savedUser.first_name,
            last_name: savedUser.last_name,
            role: savedUser.role,
            avatarUrl: savedUser.avatarUrl,
        }


        const { accessToken, refreshToken } = await this.generateJwtTokens(savedUser)

        return {
            user: clientUser,
            accessToken,
            refreshToken
        }
    }

    async registerByGithub(profile: Profile) {
        const createdUser = this.userRepository.createByProvider(profile, AuthProviders.GITHUB)
        const savedUser = await this.userRepository.save(createdUser)

        const { accessToken, refreshToken } = await this.generateJwtTokens(savedUser)

        return {
            user: savedUser,
            accessToken,
            refreshToken
        }
    }

    async login(logDto: LoginDto): Promise<IServerAuthResponse> {
        const existingUser = await this.userRepository.findByEmail(logDto.email)
        if (!existingUser) {
            throw new BadRequestException("email doesn't exist")
        }

        const { accessToken, refreshToken } = await this.generateJwtTokens(existingUser)

        const isPasswordValid = await bcrypt.compare(logDto.password, existingUser.password_hash)
        if (!isPasswordValid) {
            throw new BadRequestException("password is not true!")
        }

        const clientUser: Partial<UserEntity> = {
            id: existingUser.id,
            email: existingUser.email,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            role: existingUser.role,
            avatarUrl: existingUser.avatarUrl,
        }

        return {
            user: clientUser,
            accessToken,
            refreshToken
        }
    }

    async authMe(refreshToken: string): Promise<IServerAuthResponse> {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);

            const user = await this.userRepository.findById(payload.sub);

            if (!user) {
                throw new BadRequestException('User not found');
            }

            const { accessToken, refreshToken: newRefreshToken } = await this.generateJwtTokens(user);

            return {
                user,
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (err) {
            throw new BadRequestException('Invalid refresh token');
        }
    }

    async generateJwtTokens(user: UserEntity): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { email: user.email, sub: user.id, role: user.role };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '3d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}