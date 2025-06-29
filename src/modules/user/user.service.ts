import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Logger,
} from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./user.repository";
import { IUserUpdateDto } from "./dto/user-update.dto";

export interface IUserService {
    findAll(): Promise<UserEntity[] | null>;
    findById(id: number): Promise<UserEntity | null>;
    update(id: string, updateUserDto: IUserUpdateDto): Promise<UserEntity | null>;
    delete(id: number): Promise<boolean>;
}

@Injectable()
export class UserService implements IUserService {
    private readonly logger = new Logger(UserService.name);

    constructor(private readonly userRepository: UserRepository) {}

    async findAll(): Promise<UserEntity[]> {
        this.logger.log('Fetching all users...');
        try {
            const users = await this.userRepository.findAll();
            if (!users) {
                this.logger.warn('No users found');
                throw new NotFoundException('Users not found');
            }
            this.logger.log(`Found ${users.length} users`);
            return users;
        } catch (error) {
            this.logger.error('Error while fetching users', error.stack);
            throw new InternalServerErrorException('Failed to fetch users');
        }
    }

    async findById(id: number): Promise<UserEntity | null> {
        this.logger.log(`Fetching user with id ${id}`);
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                this.logger.warn(`User with id ${id} not found`);
                throw new NotFoundException('User not found');
            }
            this.logger.log(`User with id ${id} found`);
            return user;
        } catch (error) {
            this.logger.error(`Failed to fetch user with id ${id}`, error.stack);
            throw new InternalServerErrorException('Failed to fetch user');
        }
    }

    async update(id: string, updateUserDto: IUserUpdateDto): Promise<UserEntity | null> {
        console.log(`[Service] [User Update] Начало обновления пользователя с id: ${id}`);
        console.debug(`[Service] [User Update] DTO: ${JSON.stringify(updateUserDto)}`);

        try {
            const updatedUser = await this.userRepository.updateUser(+id, updateUserDto);

            if (!updatedUser) {
                console.warn(`[Service] [User Update] Пользователь с id ${id} не найден`);
                throw new NotFoundException('Пользователь не найден');
            }

            console.log(`[Service] [User Update] Пользователь с id ${id} успешно обновлён`);
            console.debug(`[Service] [User Update] Результат: ${JSON.stringify(updatedUser)}`);

            return updatedUser;
        } catch (error) {
            console.error(
                `[Service] [User Update] Ошибка при обновлении пользователя с id ${id}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException('Ошибка при обновлении пользователя');
        }
    }


    async delete(id: number): Promise<boolean> {
        this.logger.log(`Attempting to delete user with id ${id}`);
        try {
            const result = await this.userRepository.delete(id);
            if (result) {
                this.logger.log(`User with id ${id} successfully deleted`);
                return true;
            } else {
                this.logger.warn(`User with id ${id} not found for deletion`);
                throw new NotFoundException('User not found');
            }
        } catch (error) {
            this.logger.error(`Failed to delete user with id ${id}`, error.stack);
            throw new InternalServerErrorException('Failed to delete user');
        }
    }
}