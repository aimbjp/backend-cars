import { Request, Response } from "express";
import {getRepository, In, IsNull, Repository} from "typeorm";
import { Models } from "../../db/entities/Models";

export class ModelsController {
    static async getAllModels(req: Request, res: Response) {
        const modelRepository = getRepository(Models);
        const models = await modelRepository.find();
        res.json({models, success: true});
    }

    static async getModelsWithoutBrand(req: Request, res: Response) {
        const modelRepository = getRepository(Models);
        const models = await modelRepository.find({
            where: { brand: IsNull()}
        });
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

    static async getModelsByBrandId(req: Request, res: Response) {
        const { brandId, brandIds } = req.body;

        const modelRepository: Repository<Models> = getRepository(Models);

        if (brandId) {
            const model = await modelRepository.find({
                where: { brand: { brandId: parseInt(brandId) } },
            });

            if (model) {
                res.json({ model, success: true });
            } else {
                res.status(404).json({ message: "Model not found" });
            }
        } else if (brandIds) {
            const brandIdsArray = brandIds.map(Number);

            const models = await modelRepository.find({
                where: {
                    brand: { brandId: In(brandIdsArray) },
                },
            });

            if (models.length) {
                res.json({ models, success: true });
            } else {
                res.status(404).json({ message: "Models not found" });
            }
        } else {
            res.status(400).json({ message: "Invalid parameter(s)" });
        }
    }

    static async createModel(req: Request, res: Response) {
        if (req.body.name){
            const modelRepository = getRepository(Models);

            const model = modelRepository.create(req.body);
            await modelRepository.save(model);
            res.status(201).json({model, success: true});
        } else {
            res.status(404).json({message: "Model name needed as \"name\" param in body", success: false});
        }
    }

    static async updateModel(req: Request, res: Response) {
        const modelRepository = getRepository(Models);

        const modelId = req.body.modelId;
        const brand = req.body.brandId;
        const mergeObj = {modelId, brand}

        const model = await modelRepository.findOne({
            where: {modelId: parseInt(modelId)}
        });
        if (model) {
            modelRepository.merge(model, mergeObj);
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
