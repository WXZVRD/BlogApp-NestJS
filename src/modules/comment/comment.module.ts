import {Module} from "@nestjs/common";
import {CommentController} from "./comment.controller";
import {CommentService} from "./comment.service";
import {CommentRepository} from "./comment.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentEntity} from "./entity/comment.entity";
import {UserModule} from "../user/user.module";
import {ReviewModule} from "../review/review.module";
import {AuthModule} from "../auth/auth.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([CommentEntity]),
        UserModule,
        AuthModule,
        ReviewModule
    ],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
    exports: [CommentService]
})
export class CommentModule{}