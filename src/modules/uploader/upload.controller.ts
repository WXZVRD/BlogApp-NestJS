import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Logger,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('/upload')
export class UploadController {
    private readonly logger = new Logger(UploadController.name);

    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Файл получен: ${file.originalname}`);
        console.log(file)
        return {
            message: 'Файл успешно загружен!',
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        };
    }
}
