import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Models } from "../../db/entities/Models";

export class ModelsController {
    static async getAllModels(req: Request, res: Response) {
        const modelRepository = getRepository(Models);
        const models = await modelRepository.find();
        res.json({models, success: true});
    }

    static async getModelById(req: Request, res: Response) {
        const modelRepository = getRepository(Models);
        const model = await modelRepository.findOne({
            where: {modelId: parseInt(req.params.id)}
        });
        if (model) {
            res.json({model, success: true});
        } else {
            res.status(404).json({ message: "Model not found" });
        }
    }

    static async createModel(req: Request, res: Response) {
        const modelRepository = getRepository(Models);
        const model = modelRepository.create(req.body);
        await modelRepository.save(model);
        res.status(201).json({model, success: true});
    }

    static async updateModel(req: Request, res: Response) {
        const modelRepository = getRepository(Models);
        const model = await modelRepository.findOne({
            where: {modelId: parseInt(req.params.id)}
        });
        if (model) {
            modelRepository.merge(model, req.body);
            await modelRepository.save(model);
            res.json({model, success: true});
        } else {
            res.status(404).json({ message: "Model not found" });
        }
    }

    static async deleteModel(req: Request, res: Response) {
        const modelRepository = getRepository(Models);
        const result = await modelRepository.delete(req.params.id);
        if (result.affected) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Model not found" });
        }
    }
}
