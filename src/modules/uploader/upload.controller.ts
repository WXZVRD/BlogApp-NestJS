import {
    Controller,
    Post,
    UploadedFile, UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {CloudinaryService} from "../cloudinary/cloudinary.service";
import {AuthGuard} from "../auth/guards/auth.guard";

@Controller('/upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const uploadData = await this.cloudinaryService.uploadFile(file)

        return {
            message: 'Файл успешно загружен!',
            filename: file.originalname,
            url: uploadData.url,
            format: uploadData.format,
        };
    }
}
