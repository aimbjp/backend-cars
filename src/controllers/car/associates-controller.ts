import { Request, Response } from "express";
import {getRepository, Repository} from "typeorm";
import {Models} from "../../db/entities/Models";
import {Engines} from "../../db/entities/Engines";

export class AssociatesController {
    static async associateModelEngine(req: Request, res: Response) {
        const { modelIds, engineIds } = req.body;

        if (!modelIds || !engineIds || !modelIds.length || !engineIds.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const modelsRepository: Repository<Models> = getRepository(Models);
        const enginesRepository: Repository<Engines> = getRepository(Engines);

        try {
            const modelsPromises = modelIds.map((modelId: any) =>
                modelsRepository.findOne({
                    where: { modelId },
                    relations: ["engines"],
                })
            );
            const models = await Promise.all(modelsPromises);

            const enginesPromises = engineIds.map((engineId: any) =>
                enginesRepository.findOne({ where: engineId })
            );
            const engines = await Promise.all(enginesPromises);

            const linkedModels: Models[] = [];

            for (const model of models) {
                if (!model) {
                    continue;
                }

                const linkedEngines = [];
                for (const engineId of engineIds) {
                    const engine = engines.find((e) => e.engineId === engineId);
                    if (!engine) {
                        continue;
                    }

                    if (model.engines.some((existingEngine: any) => existingEngine.engineId === engineId)) {
                        continue;
                    }

                    linkedEngines.push(engine);
                }

                if (linkedEngines.length) {
                    model.engines.push(...linkedEngines);
                    linkedModels.push(model);
                }
            }

            if (!linkedModels.length) {
                return res.status(400).json({ message: "No links were created" });
            }

            for (const model of linkedModels) {
                await modelsRepository.save(model);
            }
            res.json({ message: "Links successfully created" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}
