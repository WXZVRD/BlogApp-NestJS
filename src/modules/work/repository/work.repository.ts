import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkEntity } from "../entity/work.entity";
import { Repository } from "typeorm";
import { IWorkFormData } from "../types/work.types";

@Injectable()
export class WorkRepository {
    constructor(
        @InjectRepository(WorkEntity)
        private readonly workRepository: Repository<WorkEntity>
    ) {}

    create(work: IWorkFormData): WorkEntity {
        console.log("Creating a new work:", work);
        return this.workRepository.create(work);
    }

    async save(workEntity: WorkEntity): Promise<any> {
        console.log("Saving work entity:", workEntity);
        const savedWork = await this.workRepository.save(workEntity);
        console.log("Saved work entity:", savedWork);
        return savedWork;
    }

    async findById(id: number) {
        console.log(`Finding work by ID: ${id}`);
        const work = await this.workRepository.findOne({
            where: {
                id,
            },
        });
        console.log("Found work:", work);
        return work;
    }

    async updateRating(workId: number, avgRating: number, ratingCount: number) {
        console.log(`Updating rating for work ID ${workId} to avgRating: ${avgRating}, ratingCount: ${ratingCount}`);
        await this.workRepository.update(workId, {
            averageRating: avgRating,
            ratingCount: ratingCount,
        });
        console.log(`Updated rating for work ID ${workId}`);
    }
}
