import {IsNotEmpty, IsNumber} from "class-validator";
import {RateTargetTypes} from "./rating.enum";

export class MakeRateDto{
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
    newValue: number
}