import {Module} from "@nestjs/common";
import {UploadController} from "./upload.controller";
import {UploadService} from "./upload.service";
import {CloudinaryService} from "../cloudinary/cloudinary.service";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [UploadController],
    providers: [UploadService, CloudinaryService],
    exports: []
})
export class UploadModule{}