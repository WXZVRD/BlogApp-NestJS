import {
    Body,
    Controller,
    Delete,
    Get, InternalServerErrorException,
    Logger, NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards
} from "@nestjs/common";
import {ReviewService} from "./services/review.service";
import {ReviewEntity} from "./entity/review.entity";
import {ReviewCreateDto} from "./dto/review-create.dto";
import {ToggleLikeDto} from "./dto/toggle-like.dto";
import {ReviewGetAllDto} from "./dto/review-getAll.dto";
import {AuthGuard} from "../auth/guards/auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorator/roles.decorator";
import {CurrentUser} from "../../common/decorators/current-user.decorator";
import {UserEntity} from "../user/entities/user.entity";

@Controller('/review')
export class ReviewController{
    constructor(
        private readonly reviewService: ReviewService,
    ) {}

    @Post('/create')
    @UseGuards(AuthGuard)
    async create(@Body() reviewData: ReviewCreateDto): Promise<ReviewEntity> {
        try {
            const review = await this.reviewService.create(reviewData);
            return review;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create review');
        }
    }

    @Get('/search')
    async search(@Query() query: ReviewGetAllDto): Promise<{ data: ReviewEntity[]; total: number }> {
        return await this.reviewService.search(query);
    }


    @Get('/screen/:id')
    async getOne(@Param('id', ParseIntPipe) id: number): Promise<ReviewEntity> {
        const review = await this.reviewService.getOne(id);
        if (!review) {
            throw new NotFoundException(`Review with id ${id} not found`);
        }
        return review;
    }

    @Get('/latest')
    getLatest(): Promise<ReviewEntity[]> {
        return this.reviewService.getLatest();
    }

    @Get('/most-rated')
    getMostRated(): Promise<ReviewEntity[]> {
        return this.reviewService.getMostRated();
    }

    @Post('/toggle-like')
    @UseGuards(AuthGuard)
    toggleLike(
        @CurrentUser() user: UserEntity,
        @Body() data: ToggleLikeDto
    ): Promise<void> {
        return this.reviewService.toggleLike(user.id, data.reviewId);
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