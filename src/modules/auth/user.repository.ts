import {UserEntity} from "../user/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {RegisterDto} from "./dto/register.dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    findByEmail(email: string) {
        return this.userRepository.findOneBy({email})
    }

    create(userData: RegisterDto) {
        return this.userRepository.create({
            email: userData.email,
            password_hash: userData.password,
            first_name: userData.firstName,
            last_name: userData.lastName,
        })
    }

    async save(userToSave: UserEntity) {
        return await this.userRepository.save(userToSave)
    }
}