import {
    Controller,
    Get,
    Put,
    Delete,
    Param,
    Body,
    NotFoundException,
    Logger,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./entities/user.entity";
import { IUserUpdateDto } from "./dto/user-update.dto";

@Controller('/users')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {}

    @Get('/all')
    async getAllUsers(): Promise<UserEntity[]> {
        this.logger.log('Fetching all users');
        const users = await this.userService.findAll();
        this.logger.log(`Fetched ${users.length} users`);
        return users;
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserEntity> {
        this.logger.log(`Fetching user with id ${id}`);
        const user = await this.userService.findById(+id);
        if (!user) {
            this.logger.warn(`User with id ${id} not found`);
            throw new NotFoundException(`User with id ${id} not found`);
        }
        this.logger.log(`User with id ${id} fetched`);
        return user;
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: IUserUpdateDto,
    ): Promise<UserEntity> {
        console.log(`[PUT] /users/${id} — попытка обновления пользователя`);
        console.debug(`Payload: ${JSON.stringify(updateUserDto)}`);

        const updated = await this.userService.update(id, updateUserDto);

        if (!updated) {
            console.warn(`[PUT] /users/${id} — пользователь не найден`);
            throw new NotFoundException(`Пользователь с ID ${id} не найден`);
        }

        console.log(`[PUT] /users/${id} — пользователь успешно обновлён`);
        console.debug(`Обновлённые данные: ${JSON.stringify(updated)}`);

        return updated;
    }


    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
        this.logger.log(`Deleting user with id ${id}`);
        const deleted = await this.userService.delete(+id);
        if (!deleted) {
            this.logger.warn(`User with id ${id} not found for deletion`);
            throw new NotFoundException(`User with id ${id} not found`);
        }
        this.logger.log(`User with id ${id} deleted`);
        return { message: `User with id ${id} deleted` };
    }
}