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
        this.logger.log(`Updating user with id ${id}`);
        try {
            const updatedUser = await this.userRepository.updateUser(+id, updateUserDto);
            if (!updatedUser) {
                this.logger.warn(`User with id ${id} not found for update`);
                throw new NotFoundException('User not found');
            }
            this.logger.log(`User with id ${id} successfully updated`);
            return updatedUser;
        } catch (error) {
            this.logger.error(`Failed to update user with id ${id}`, error.stack);
            throw new InternalServerErrorException('Failed to update user');
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