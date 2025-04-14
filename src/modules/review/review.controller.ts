import {Body, Controller, Delete, Get, Param, Post, Put, Req} from "@nestjs/common";
import {ReviewService} from "./services/review.service";
import {ReviewEntity} from "./entity/review.entity";
import {ReviewCreateDto} from "./dto/review-create.dto";
import {ToggleLikeDto} from "./dto/toggle-like.dto";

interface IReviewController {
    getHello(): string

    create(reviewData: ReviewCreateDto): Promise<ReviewEntity>

    getAll(): Promise<ReviewEntity[]>

    getLatest(): Promise<ReviewEntity[]>

    delete(id: number): Promise<void>

    update(id: number, reviewData: Partial<ReviewEntity>): Promise<void>

    toggleLike(data: ToggleLikeDto): Promise<void>
}

@Controller('/review')
export class ReviewController implements IReviewController{
    constructor(
        private readonly reviewService: ReviewService,
    ) {}

    @Get()
    getAll(): Promise<ReviewEntity[]> {
        return this.reviewService.getAll()
    }

    @Get('/latest')
    getLatest(): Promise<ReviewEntity[]> {
        return this.reviewService.getLatest()
    }

    @Post('/create')
    create(@Body() reviewData: ReviewCreateDto): Promise<ReviewEntity> {
        return this.reviewService.create(reviewData)
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.reviewService.delete(id)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() reviewData: Partial<ReviewEntity>): Promise<void> {
        await this.reviewService.update(id, reviewData)
    }

    @Post('/toggle-like')
    toggleLike(@Body() data: ToggleLikeDto): Promise<void> {
        const { userId, reviewId } = data;
        return this.reviewService.toggleLike(userId, reviewId)
    }

    @Get()
    getHello(): string {
        return this.reviewService.getHello()
    }
}