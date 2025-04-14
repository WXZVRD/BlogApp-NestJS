import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {LikeEntity} from "../entity/like.entity";
import {Repository} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {ReviewEntity} from "../entity/review.entity";


@Injectable()
export class LikeRepository {
    constructor(
        @InjectRepository(LikeEntity)
        private readonly likeRepository: Repository<LikeEntity>
    ) {}

    async findOneByUserAndReview(user: UserEntity, review: ReviewEntity): Promise<LikeEntity | null> {
        return this.likeRepository.findOne({
            where: {
                user: { id: user.id },
                review: { id: review.id }
            },
            relations: ['user', 'review']
        });
    }

    create(user: UserEntity, review: ReviewEntity): LikeEntity {
        return this.likeRepository.create({ user, review });
    }

    async remove(likeEntity: LikeEntity) {
        await this.likeRepository.remove(likeEntity)
    }

    async save(likeEntity: LikeEntity) {
        await this.likeRepository.save(likeEntity)
    }
}