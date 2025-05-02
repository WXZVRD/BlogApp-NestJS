import { v2 as cloudinary } from 'cloudinary';
import {ConfigService} from "@nestjs/config";

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: async (configService: ConfigService) => {
        console.log(configService.get('CLOUDINARY_NAME'))
        console.log(configService.get('CLOUDINARY_API_KEY'))
        console.log(configService.get('CLOUDINARY_API_SECRET'))
        return cloudinary.config({
            cloud_name: configService.get<string>('CLOUDINARY_NAME'),
            api_key: configService.get<string>("CLOUDINARY_API_KEY"),
            api_secret: configService.get<string>("CLOUDINARY_API_SECRET"),
        });
    },
    inject: [ConfigService]
};
