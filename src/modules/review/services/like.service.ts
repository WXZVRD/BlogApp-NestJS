import {Injectable} from "@nestjs/common";
import {LikeRepository} from "../repository/like.repository";
import {UserEntity} from "../../user/entities/user.entity";
import {ReviewEntity} from "../entity/review.entity";

interface ILikeService {
    toggleLike(user: UserEntity, review: ReviewEntity): Promise<void>
}

@Injectable()
export class LikeService implements ILikeService{
    constructor(
        private readonly likeRepository: LikeRepository
    ) {}

    async toggleLike(user: UserEntity, review: ReviewEntity): Promise<void> {
        const existing = await this.likeRepository.findOneByUserAndReview(user, review);

        if (existing) {
            await this.likeRepository.remove(existing);
            return;
        }

        const newLike = this.likeRepository.create(user, review);

        await this.likeRepository.save(newLike);
    }
}