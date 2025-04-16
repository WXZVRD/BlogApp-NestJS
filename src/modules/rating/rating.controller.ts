import {Body, Controller, Post} from "@nestjs/common";
import {RatingService} from "./rating.service";
import {MakeRateDto} from "./make-rate.dto";
import {ReviewEntity} from "../review/entity/review.entity";

interface IRatingController{
    putRating(data: MakeRateDto): Promise<ReviewEntity>
}

@Controller('/rating')
export class RatingController implements IRatingController{
    constructor(
        private readonly ratingService: RatingService
    ) {
    }

    @Post('/put')
    async putRating(@Body() data: MakeRateDto): Promise<ReviewEntity> {
        console.log("DATA CONTROLLER: ", data)
        return await this.ratingService.rate(data.userId, data.targetType, data.targetId, data.newValue)
    }

}