import {IsNotEmpty, IsNumber} from "class-validator";
import {RateTargetTypes} from "../types/rating.enum";

export class CreateRateDto{
    @IsNotEmpty()
    @IsNumber()
    userId: number

    @IsNotEmpty()
    targetType: RateTargetTypes

    @IsNotEmpty()
    @IsNumber()
    targetId: number

    @IsNotEmpty()
    @IsNumber()
    value: number
}