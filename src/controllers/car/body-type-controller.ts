import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { BodyType } from "../../db/entities/BodyType";
import {Engines} from "../../db/entities/Engines";

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
        if (!req.body.name) res.status(404).json({ message: "Needed name in body", success: false})

        const bodyTypeRepository = getRepository(BodyType);

        const existingBodyType = await bodyTypeRepository.findOne({ where: { type: req.body.name } });
        if (existingBodyType) {
            return res.status(201).json({message: 'BodyType already exists.', engine: existingBodyType, success: true});
        }

        const bodyType = bodyTypeRepository.create({type: req.body.name});
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

    static async getBodyTypesByModelId (req: Request, res: Response) {
        try {
            if (!req.body.modelId) res.status(404).json({ message: "Needed modelId in body", success: false})

            const bodyTypeRepository = getRepository(BodyType);

            const existingBodyTypes = await bodyTypeRepository.find({
                where: { models: {modelId: req.body.modelId} }
            });

            res.status(201).json({bodytypes: existingBodyTypes, success: true});

        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }
}
