import {Module} from "@nestjs/common";
import {UploadController} from "./upload.controller";
import {UploadService} from "./upload.service";
import {CloudinaryService} from "../cloudinary/cloudinary.service";

@Module({
    imports: [],
    controllers: [UploadController],
    providers: [UploadService, CloudinaryService],
    exports: []
})
export class UploadModule{}