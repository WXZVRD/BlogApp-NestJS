import {forwardRef, Module} from "@nestjs/common";
import {RatingService} from "./rating.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RatingEntity} from "./entity/rating.entity";
import {RatingRepository} from "./repository/rating.repository";
import {WorkModule} from "../work/work.module";
import {ReviewModule} from "../review/review.module";
import {RatingController} from "./rating.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([RatingEntity]),
        WorkModule,
        forwardRef(() => ReviewModule),
    ],
    controllers: [RatingController],
    providers: [RatingService, RatingRepository],
    exports: [RatingService],
})
export class RatingModule {}
