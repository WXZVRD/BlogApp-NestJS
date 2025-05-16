import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards} from "@nestjs/common";
import {ReviewService} from "./services/review.service";
import {ReviewEntity} from "./entity/review.entity";
import {ReviewCreateDto} from "./dto/review-create.dto";
import {ToggleLikeDto} from "./dto/toggle-like.dto";
import {ReviewGetAllDto} from "./dto/review-getAll.dto";
import {AuthGuard} from "../auth/guards/auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorator/roles.decorator";

interface IReviewController {
    getHello(): string

    create(reviewData: ReviewCreateDto): Promise<ReviewEntity>

    getAll(option: ReviewGetAllDto): Promise<ReviewEntity[]>

    getLatest(): Promise<ReviewEntity[]>

    getMostRated(): Promise<ReviewEntity[]>

    getOne(id: number): Promise<ReviewEntity>

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
    @UseGuards(AuthGuard)
    getHello(): string {
        return this.reviewService.getHello()
    }

    @Get('/all')
    getAll(@Query() options: ReviewGetAllDto): Promise<ReviewEntity[]> {
        return this.reviewService.getAll(options);
    }

    @Get('/screen/:id')
    getOne(@Param('id', ParseIntPipe) id: number): Promise<ReviewEntity> {
        return this.reviewService.getOne(id)
    }

    @Get('/latest')
    getLatest(): Promise<ReviewEntity[]> {
        return this.reviewService.getLatest()
    }

    @Get('/most-rated')
    getMostRated(): Promise<ReviewEntity[]> {
        return this.reviewService.getMostRated()
    }

    @Post('/create')
    @UseGuards(AuthGuard)
    create(@Body() reviewData: ReviewCreateDto): Promise<ReviewEntity> {
        return this.reviewService.create(reviewData)
    }

    @Post('/toggle-like')
    @UseGuards(AuthGuard)
    toggleLike(@Body() data: ToggleLikeDto): Promise<void> {
        const { userId, reviewId } = data;
        return this.reviewService.toggleLike(userId, reviewId)
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(['admin', 'user'])
    async delete(@Param('id') id: number): Promise<void> {
        await this.reviewService.delete(id)
    }

    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(['admin', 'user'])
    async update(@Param('id') id: number, @Body() reviewData: Partial<ReviewEntity>): Promise<void> {
        await this.reviewService.update(id, reviewData)
    }
}