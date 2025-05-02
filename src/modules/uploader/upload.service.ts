import {Injectable} from "@nestjs/common";

@Injectable()
export class UploadService{
    constructor() {
    }

    handleUpload(file: Express.Multer.File) {
        console.log("Service upload: file [", file)
        return "Effectly uploaded!"
    }
}