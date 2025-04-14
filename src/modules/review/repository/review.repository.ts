import {ReviewEntity} from "../entity/review.entity";
import {Repository, UpdateResult} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {ReviewCreateDto} from "../dto/review-create.dto";
import {UserEntity} from "../../user/entities/user.entity";

@Injectable()
export class ReviewRepository {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>
    ) {}

    async findById(id: number) {
        return await this.reviewRepository.findOneBy({id})
    }

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

    async getAll(): Promise<any[]> {
        return this.reviewRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.likes', 'like')
            .leftJoin('like.user', 'likeUser')
            .leftJoin('review.user', 'author')
            .select([
                'review.id',
                'review.content',
                'review.createdAt',
                'review.updatedAt',
                'like.id',
                'likeUser.id',
                'author.id',
                'author.first_name',
                'author.last_name',
                'author.avatarUrl'
            ])
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

    async save(reviewToSave: ReviewEntity ) {
        return await this.reviewRepository.save(reviewToSave)
    }
}