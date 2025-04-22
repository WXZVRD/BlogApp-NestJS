import {forwardRef, Module} from "@nestjs/common";
import {ReviewController} from "./review.controller";
import {ReviewService} from "./services/review.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReviewEntity} from "./entity/review.entity";
import {ReviewRepository} from "./repository/review.repository";
import {UserModule} from "../user/user.module";
import {LikeRepository} from "./repository/like.repository";
import {LikeService} from "./services/like.service";
import {LikeEntity} from "./entity/like.entity";
import {WorkModule} from "../work/work.module";
import {RatingModule} from "../rating/rating.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ReviewEntity, LikeEntity]),
        UserModule,
        WorkModule,
        forwardRef(() => RatingModule),
    ],
    controllers: [ReviewController],
    providers: [ReviewService, ReviewRepository, LikeRepository, LikeService],
    exports: [ReviewRepository, TypeOrmModule],
})
export class ReviewModule {}