import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Logger,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {CloudinaryService} from "../cloudinary/cloudinary.service";

@Controller('/upload')
export class UploadController {
    private readonly logger = new Logger(UploadController.name);

    constructor(
        private readonly uploadService: UploadService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Файл получен: ${file.originalname}`);
        console.log(file)
        const uploadData = await this.cloudinaryService.uploadFile(file)
        return {
            message: 'Файл успешно загружен!',
            filename: file.originalname,
            url: uploadData.url,
            format: uploadData.format,
        };
    }
}
