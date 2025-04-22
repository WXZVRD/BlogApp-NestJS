import { Controller, Post, UploadedFile, UseInterceptors, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

interface IUploadController {
    uploadFile(file: Express.Multer.File): void;
}

@Controller('/upload')
export class UploadController implements IUploadController {
    private readonly logger = new Logger(UploadController.name);

    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File): void {
        if (file) {
            this.logger.log('Received file for upload');
            this.logger.log(`File name: ${file.originalname}`);
            this.logger.log(`File size: ${file.size} bytes`);
            this.logger.log(`File mimetype: ${file.mimetype}`);

            this.logger.log('File uploaded successfully');
        }
        console.log(file)
    }
}
