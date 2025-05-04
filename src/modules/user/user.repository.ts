import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {RegisterDto} from "../auth/dto/register.dto";
import {UserEntity} from "./entities/user.entity";
import {AuthProviders} from "../../shared/enums/auth/authProvider";
import {Profile} from "passport-github";


interface OAuthProfileJson {
    email: string;
    id: string;
    avatar_url?: string;
}


@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    findByEmail(email: string) {
        return this.userRepository.findOneBy({email})
    }

    findByProvider(provider_id: number, provider: AuthProviders) {
        return this.userRepository.findOneBy({
            provider_id,
            provider
        })
    }

    findById(id: number) {
        return this.userRepository.findOneBy({id})
    }

    create(userData: RegisterDto) {
        return this.userRepository.create({
            email: userData.email,
            password_hash: userData.password,
            first_name: userData.firstName,
            last_name: userData.lastName,
        })
    }

    createByProvider(profile: Profile, provider: AuthProviders) {
        const profileJson = profile._json as OAuthProfileJson

        return this.userRepository.create({
            email: profileJson.email,
            provider_id: Number(profileJson.id),
            provider: provider,
            first_name: profile.username,
            avatarUrl: profile.photos?.[0]?.value ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s'
        })
    }

    async save(userToSave: UserEntity) {
        return await this.userRepository.save(userToSave)
    }
}