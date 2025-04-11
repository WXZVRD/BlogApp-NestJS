import {Module} from "@nestjs/common";
import {ReviewController} from "./review.controller";
import {ReviewService} from "./review.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReviewEntity} from "./entity/review.entity";
import {ReviewRepository} from "./review.repository";
import {UserModule} from "../user/user.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([ReviewEntity]),
        UserModule
    ],
    controllers: [ReviewController],
    providers: [ReviewService, ReviewRepository]
})
export class ReviewModule{}