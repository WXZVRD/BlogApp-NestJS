import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from "@nestjs/common";
import { UserService } from "./user.service";
import {UserEntity} from "./entities/user.entity";
import {IUserUpdateDto} from "./dto/user-update.dto";

@Controller('/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/all')
    getAllUsers(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserEntity> {
        const user = await this.userService.findById(+id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: IUserUpdateDto,
    ): Promise<UserEntity> {
        const updated = await this.userService.update(id, updateUserDto);
        if (!updated) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return updated;
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
        const deleted = await this.userService.delete(+id);
        if (!deleted) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return { message: `User with id ${id} deleted` };
    }
}