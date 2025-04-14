import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewGetAllDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    take?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset?: number;
}