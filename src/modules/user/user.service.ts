import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {UserEntity} from "./entities/user.entity";
import {UserRepository} from "./user.repository";
import {IUserUpdateDto} from "./dto/user-update.dto";

export interface IUserService {
    findAll(): Promise<UserEntity[] | null>;

    findById(id: number): Promise<UserEntity | null>;

    update(id: string, updateUserDto: IUserUpdateDto): Promise<UserEntity | null>;

    delete(id: number): Promise<boolean>;
}

@Injectable()
export class UserService implements IUserService {
    constructor(
        private readonly userRepository: UserRepository
    ) {
    }
    async findAll(): Promise<UserEntity[]> {
        try {
            const users = await this.userRepository.findAll()

            if (!users) throw new NotFoundException('Users not found')

            return users;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch users')
        }
    }

    async findById(id: number): Promise<UserEntity | null> {
        try {
            const user = await this.userRepository.findById(id)

            if (!user) throw new NotFoundException('User not found')

            return user;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch user')
        }
    }

    async update(id: string, updateUserDto: IUserUpdateDto): Promise<UserEntity | null> {
        try {
            const updatedUser = await this.userRepository.updateUser(+id, updateUserDto)

            return updatedUser;
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user')
        }
    }

    async delete(id: number): Promise<boolean> {
        return this.userRepository.delete(id);
    }
}