import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { BodyType } from "../../db/entities/BodyType";

export class BodyTypeController {
    static async getAllBodyTypes(req: Request, res: Response) {
        const bodyTypeRepository = getRepository(BodyType);
        const bodyTypes = await bodyTypeRepository.find();
        res.json({bodyTypes, success: true});
    }

    static async getBodyTypeById(req: Request, res: Response) {
        const bodyTypeRepository = getRepository(BodyType);
        const bodyType = await bodyTypeRepository.findOne({
            where: {bodyTypeId: parseInt(req.params.id)}
        });
        if (bodyType) {
            res.json({bodyType, success: true});
        } else {
            res.status(404).json({ message: "Body type not found" });
        }
    }

    static async createBodyType(req: Request, res: Response) {
        const bodyTypeRepository = getRepository(BodyType);
        const bodyType = bodyTypeRepository.create(req.body);
        await bodyTypeRepository.save(bodyType);
        res.status(201).json({bodyType, success: true});
    }

    static async updateBodyType(req: Request, res: Response) {
        const bodyTypeRepository = getRepository(BodyType);
        const bodyType = await bodyTypeRepository.findOne({
            where: {bodyTypeId: parseInt(req.params.id)}
        });
        if (bodyType) {
            bodyTypeRepository.merge(bodyType, req.body);
            await bodyTypeRepository.save(bodyType);
            res.json({bodyType, success: true});
        } else {
            res.status(404).json({ message: "Body type not found" });
        }
    }

    static async deleteBodyType(req: Request, res: Response) {
        const bodyTypeRepository = getRepository(BodyType);
        const result = await bodyTypeRepository.delete(req.params.id);
        if (result.affected) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Body type not found" });
        }
    }
}
