// src/config/multer.config.ts

import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config(); // Чтобы .env работал

export const multerConfig = {
    dest: './upload', // Папка по умолчанию для сохранения файлов
};

export const multerOptions = {
    // Ограничения на размер файла
    limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB по умолчанию
    },

    // Фильтр типов файлов
    fileFilter: (req: any, file: Express.Multer.File, cb: Function) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            cb(
                new HttpException(
                    `Неподдерживаемый тип файла ${extname(file.originalname)}`,
                    HttpStatus.BAD_REQUEST,
                ),
                false,
            );
        }
    },

    // Настройка хранилища (папка + имя файла)
    storage: diskStorage({
        destination: (req: any, file: Express.Multer.File, cb: Function) => {
            const uploadPath = multerConfig.dest;

            // Создаем папку, если не существует
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },

        filename: (req: any, file: Express.Multer.File, cb: Function) => {
            const fileExtName = extname(file.originalname); // .jpg, .png и т.д.
            const uniqueName = `${uuid()}${fileExtName}`;
            cb(null, uniqueName);
        },
    }),
};
