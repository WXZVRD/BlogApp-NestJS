import {ReviewEntity} from "./entity/review.entity";
import {Repository} from "typeorm";
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

    create(reviewData: ReviewCreateDto, user: UserEntity) {
        return this.reviewRepository.create({
            content: reviewData.content,
            user: user
        })
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