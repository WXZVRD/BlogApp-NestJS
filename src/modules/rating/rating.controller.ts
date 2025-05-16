import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {RatingService} from "./rating.service";
import {CreateRateDto} from "./dto/make-rate.dto";
import {RateTargetTypes} from "./types/rating.enum";
import {AuthGuard} from "../auth/guards/auth.guard";


@Controller('rating')
export class RatingController{
    constructor(
        private readonly ratingService: RatingService
    ) {
    }

    @Post('rate-review')
    @UseGuards(AuthGuard)
    async rateReview(
        @Body() ratingDto: CreateRateDto,
    ) {
        await this.ratingService.rate(
            ratingDto.userId,
            ratingDto.targetId,
            RateTargetTypes.REVIEW,
            ratingDto.value
        );
    }
}