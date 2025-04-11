import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {RegisterDto} from "../auth/dto/register.dto";
import {UserEntity} from "./entities/user.entity";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    findByEmail(email: string) {
        return this.userRepository.findOneBy({email})
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

    async save(userToSave: UserEntity) {
        return await this.userRepository.save(userToSave)
    }
}