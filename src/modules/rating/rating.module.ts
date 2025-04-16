import {Module} from "@nestjs/common";
import {RatingService} from "./rating.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RatingEntity} from "./entity/rating.entity";
import {RatingRepository} from "./rating.repository";
import {RatingController} from "./rating.controller";
import {ReviewRepository} from "../review/repository/review.repository";
import {ReviewModule} from "../review/review.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([RatingEntity]),
        ReviewModule
    ],
    controllers: [RatingController],
    providers: [RatingService, RatingRepository, ReviewRepository],
    exports: [RatingService]
})
export class RatingModule{}