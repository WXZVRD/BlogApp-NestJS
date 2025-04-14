import {Module} from "@nestjs/common";
import {CommentController} from "./comment.controller";
import {CommentService} from "./comment.service";
import {CommentRepository} from "./comment.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentEntity} from "./entity/comment.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([CommentEntity]),
    ],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
    exports: [CommentService]
})
export class CommentModule{}