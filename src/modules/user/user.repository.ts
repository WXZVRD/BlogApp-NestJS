import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
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

    createByLocal(userData: Partial<UserEntity>): UserEntity {
        return this.userRepository.create({
            email: userData.email,
            password_hash: userData.password_hash,
            first_name: userData.first_name,
            last_name: userData.last_name,
            avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s'
        })
    }

    createByProvider(profile: Profile, provider: AuthProviders): UserEntity {
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

    async findAll(): Promise<UserEntity[] | null> {
        return this.userRepository.find()
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: { email }
        })
    }

    async findById(id: number): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: { id }
        })
    }

    async findByProvider(provider_id: number, provider: AuthProviders) {
        return this.userRepository.findOneBy({
            provider_id,
            provider
        })
    }

    async updateUser(
        id: number,
        updateUserDto: Partial<UserEntity>
    ): Promise<UserEntity | null> {

        console.log(`Попытка обновления пользователя с ID: ${id}`);
        console.debug(`Данные для обновления: ${JSON.stringify(updateUserDto)}`);

        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            console.warn(`Пользователь с ID ${id} не найден`);
            return null;
        }

        console.log(`Пользователь найден: ${user.email || user.id}`);
        Object.assign(user, updateUserDto);

        const updatedUser = await this.userRepository.save(user);
        console.log(`Пользователь с ID ${id} успешно обновлён`);
        console.debug(`Обновлённые данные: ${JSON.stringify(updatedUser)}`);

        return updatedUser;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.userRepository.delete({ id });

        return result.affected !== 0;
    }
}
