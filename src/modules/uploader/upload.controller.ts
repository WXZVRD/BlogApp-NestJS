import {
    Controller,
    Post,
    UploadedFile, UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {CloudinaryService} from "../cloudinary/cloudinary.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorator/roles.decorator";

@Controller('/upload')
export class UploadController {
    constructor(
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(['admin', 'user'])
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
