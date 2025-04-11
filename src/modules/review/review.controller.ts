import {Body, Controller, Get, Post} from "@nestjs/common";
import {ReviewService} from "./review.service";
import {ReviewEntity} from "./entity/review.entity";
import {ReviewCreateDto} from "./dto/review-create.dto";

interface IReviewController {
    getHello(): string

    create(reviewData: ReviewCreateDto): Promise<ReviewEntity>

    getAll(): Promise<ReviewEntity[]>
}

@Controller('/review')
export class ReviewController implements IReviewController{
    constructor(
        private readonly reviewService: ReviewService
    ) {
    }

    @Get()
    getAll(): Promise<ReviewEntity[]> {
        return this.reviewService.getAll()
    }

    @Post('/create')
    create(@Body() reviewData: ReviewCreateDto): Promise<ReviewEntity> {
        return this.reviewService.create(reviewData)
    }

    @Get()
    getHello(): string {
        return this.reviewService.getHello()
    }
}