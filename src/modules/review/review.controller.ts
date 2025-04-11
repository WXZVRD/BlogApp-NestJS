import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {ReviewService} from "./review.service";
import {ReviewEntity} from "./entity/review.entity";
import {ReviewCreateDto} from "./dto/review-create.dto";

interface IReviewController {
    getHello(): string

    create(reviewData: ReviewCreateDto): Promise<ReviewEntity>

    getAll(): Promise<ReviewEntity[]>

    delete(id: number): Promise<void>

    update(id: number, reviewData: Partial<ReviewEntity>): Promise<void>
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

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.reviewService.delete(id)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() reviewData: Partial<ReviewEntity>): Promise<void> {
        await this.reviewService.update(id, reviewData)
    }

    @Get()
    getHello(): string {
        return this.reviewService.getHello()
    }
}