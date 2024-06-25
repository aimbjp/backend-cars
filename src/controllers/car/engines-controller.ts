import { Request, Response } from "express";
import {getRepository, In} from "typeorm";
import { Engines } from "../../db/entities/Engines";

export class EnginesController {
    static async getAllEngines(req: Request, res: Response) {
        const engineRepository = getRepository(Engines);
        const engines = await engineRepository.find();
        res.json({engines, success: true});
    }

    static async getEngineById(req: Request, res: Response) {
        const engineRepository = getRepository(Engines);
        const engine = await engineRepository.findOne({
            where: {engineId: parseInt(req.params.id)}
        });
        if (engine) {
            res.json({engine, success: true});
        } else {
            res.status(404).json({ message: "Engine not found" });
        }
    }

    static async createEngine(req: Request, res: Response) {
        if (!req.body.name) res.status(404).json({ message: "Needed name in body", success: false})

        const engineRepository = getRepository(Engines);

        const existingEngine = await engineRepository.findOne({ where: { type: req.body.name } });
        if (existingEngine) {
            return res.status(201).json({message: 'Engine already exists.', engine: existingEngine, success: true});
        }

        const engine = engineRepository.create({type: req.body.name});
        await engineRepository.save(engine);
        res.status(201).json({engine, success: true});
    }

    static async updateEngine(req: Request, res: Response) {
        const engineRepository = getRepository(Engines);
        const engine = await engineRepository.findOne({
            where: {engineId: parseInt(req.params.id)}
        });
        if (engine) {
            engineRepository.merge(engine, req.body);
            await engineRepository.save(engine);
            res.json({engine, success: true});
        } else {
            res.status(404).json({ message: "Engine not found" });
        }
    }

    static async deleteEngine(req: Request, res: Response) {
        const engineRepository = getRepository(Engines);
        const result = await engineRepository.delete(req.params.id);
        if (result.affected) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Engine not found" });
        }
    }

    static async getEnginesByModelId(req: Request, res: Response) {
        try {
            const { modelId } = req.body;
            if (!modelId) {
                return res.status(400).json({ message: "Model ID is required", success: false });
            }

            const engineRepository = getRepository(Engines);
            const whereCondition = Array.isArray(modelId) ?
                { models: { modelId: In(modelId) } } :
                { models: { modelId: modelId } };

            const existingEngine = await engineRepository.find({
                where: whereCondition,
                relations: ['models']
            });

            res.json({ engines: existingEngine, success: true });
        } catch (error: any) {
            console.error("Failed to fetch engines by model ID:", error);
            res.status(500).send({ message: error.message, success: false });
        }
    }
}
