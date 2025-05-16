import { IsBoolean, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { UserRoles } from "../../../shared/enums/user/userRole.enum";

export class IUserUpdateDto {
    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles;

    @IsOptional()
    @IsBoolean()
    isBlocked?: boolean;

    @IsOptional()
    @IsUrl()
    avatarUrl?: string;
}