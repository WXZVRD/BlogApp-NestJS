import {Controller} from "@nestjs/common";

interface IWorkController {

}

@Controller('/work')
export class WorkController implements IWorkController{
    constructor() {
    }
}