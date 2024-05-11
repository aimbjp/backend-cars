import { Request, Response } from "express";
import {getRepository, In} from "typeorm";
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

    static async getBodyTypesByModelId(req: Request, res: Response) {
        try {
            const { modelId } = req.body;
            if (!modelId) {
                return res.status(400).json({ message: "Model ID is required", success: false });
            }

            const bodyTypeRepository = getRepository(BodyType);
            const whereCondition = Array.isArray(modelId) ?
                { models: { modelId: In(modelId) } } :
                { models: { modelId: modelId } };

            const existingBodyTypes = await bodyTypeRepository.find({
                where: whereCondition,
                relations: ['models']
            });

            res.json({ bodytypes: existingBodyTypes, success: true });
        } catch (error: any) {
            console.error("Failed to fetch body types by model ID:", error);
            res.status(500).send({ message: error.message, success: false });
        }
    }
}
