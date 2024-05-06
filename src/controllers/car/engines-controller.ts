import { Request, Response } from "express";
import { getRepository } from "typeorm";
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
        const engineRepository = getRepository(Engines);
        const engine = engineRepository.create(req.body);
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
}
