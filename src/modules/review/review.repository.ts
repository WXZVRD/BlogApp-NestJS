import {ReviewEntity} from "./entity/review.entity";
import {Repository, UpdateResult} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {ReviewCreateDto} from "./dto/review-create.dto";
import {UserEntity} from "../user/entities/user.entity";

@Injectable()
export class ReviewRepository {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>
    ) {}

    findById(id: number) {
        return this.reviewRepository.findOneBy({id})
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

    getAll() {
        return this.reviewRepository.find({
            relations: ['user']
        })
    }

    async save(reviewToSave: ReviewEntity ) {
        return await this.reviewRepository.save(reviewToSave)
    }
}