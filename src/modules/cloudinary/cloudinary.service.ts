import {Injectable} from "@nestjs/common";
import {CloudinaryResponse} from "./cloudinary.type";
import { v2 as cloudinary } from 'cloudinary';
const streamifier = require('streamifier');

interface ICloudinaryService {
    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse>
}

@Injectable()
export class CloudinaryService implements ICloudinaryService{
    constructor() {
    }

    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    console.log("Cloudinary stream error: ", error)
                    console.log("Cloudinary stream result: ", result)
                    if (error) return reject(error);
                    if (result) return resolve(result);
                }
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }


}