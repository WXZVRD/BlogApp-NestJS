import {ReviewEntity} from "../entity/review.entity";
import {Repository, UpdateResult} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {ReviewCreateDto} from "../dto/review-create.dto";
import {UserEntity} from "../../user/entities/user.entity";
import {ReviewGetAllDto} from "../dto/review-getAll.dto";

@Injectable()
export class ReviewRepository {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>
    ) {}
    create(reviewData: ReviewCreateDto, user: UserEntity): ReviewEntity {
        return this.reviewRepository.create({
            content: reviewData.content,
            user: user
        })
    }

    async update(id: number, reviewData: Partial<ReviewEntity>): Promise<UpdateResult> {
        return await this.reviewRepository.update(id, reviewData)
    }

    async delete(id: number): Promise<void> {
        await this.reviewRepository.delete({ id });
    }

    async findById(id: number) {

        return this.reviewRepository
            .createQueryBuilder('review')
            .where('review.id = :id', { id: id })
            .leftJoinAndSelect('review.user', 'author')
            .leftJoinAndSelect('review.comments', 'comments')
            .leftJoinAndSelect('review.likes', 'likes')
            .getOne()
    }

    async getAll(query: ReviewGetAllDto): Promise<ReviewEntity[]> {
        const { take = 10, page = 1, offset } = query;

        const skip = offset ?? (page - 1) * take;

        return this.reviewRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.likes', 'like')
            .leftJoin('like.user', 'likeUser')
            .leftJoin('review.user', 'author')
            .select([
                'review.id',
                'review.content',
                'review.averageRating',
                'review.ratingCount',
                'review.createdAt',
                'review.updatedAt',
                'like.id',
                'likeUser.id',
                'author.id',
                'author.first_name',
                'author.last_name',
                'author.avatarUrl'
            ])
            .skip(skip)
            .take(take)
            .getMany();
    }

    getLatest(): Promise<ReviewEntity[]> {
        return this.reviewRepository.find({
            take: 10,
            order: {
                createdAt: 'DESC'
            }
        })
    }

    getMostRated(): Promise<ReviewEntity[]> {
        return this.reviewRepository.find({
            take: 10,
            order: { averageRating: "DESC"}
        })
    }

    async save(reviewToSave: ReviewEntity ) {
        return await this.reviewRepository.save(reviewToSave)
    }

    async updateRating(reviewId: number, avgRating: number, ratingCount: number) {
        await this.reviewRepository.update(reviewId, {
            averageRating: avgRating,
            ratingCount: ratingCount
        })
    }
}