import { Request, Response } from "express";
import {getRepository, Repository} from "typeorm";
import {Models} from "../../db/entities/Models";
import {Engines} from "../../db/entities/Engines";
import {Drives} from "../../db/entities/Drives";
import {BodyType} from "../../db/entities/BodyType";
import {Transmissions} from "../../db/entities/Transmissions";
import {Color} from "../../db/entities/Color";

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


    static async associateModelDrive(req: Request, res: Response) {
        const { modelIds, driveIds } = req.body;

        if (!modelIds || !driveIds || !modelIds.length || !driveIds.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const modelsRepository: Repository<Models> = getRepository(Models);
        const drivesRepository: Repository<Drives> = getRepository(Drives);

        try {
            const modelsPromises = modelIds.map((modelId: number) =>
                modelsRepository.findOne({
                    where: { modelId },
                    relations: ["drives"],
                })
            );
            const models = await Promise.all(modelsPromises);

            const drivesPromises = driveIds.map((driveId: number) =>
                drivesRepository.findOne({ where: { driveId } })
            );
            const drives = await Promise.all(drivesPromises);

            const linkedModels: Models[] = [];

            for (const model of models) {
                if (!model) continue;

                const linkedDrives = [];
                for (const driveId of driveIds) {
                    const drive = drives.find((d) => d.driveId === driveId);
                    if (!drive) continue;

                    if (model.drives.some((existingDrive: any) => existingDrive.driveId === driveId)) continue;

                    linkedDrives.push(drive);
                }

                if (linkedDrives.length) {
                    model.drives.push(...linkedDrives);
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

    static async associateModelBodyType(req: Request, res: Response) {
        const { modelIds, bodyTypeIds } = req.body;

        if (!modelIds || !bodyTypeIds || !modelIds.length || !bodyTypeIds.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const modelsRepository: Repository<Models> = getRepository(Models);
        const bodyTypesRepository: Repository<BodyType> = getRepository(BodyType);

        try {
            const modelsPromises = modelIds.map((modelId: number) =>
                modelsRepository.findOne({
                    where: { modelId },
                    relations: ["bodyTypes"],
                })
            );
            const models = await Promise.all(modelsPromises);

            const bodyTypesPromises = bodyTypeIds.map((bodyTypeId: number) =>
                bodyTypesRepository.findOne({ where: { bodyTypeId } })
            );
            const bodyTypes = await Promise.all(bodyTypesPromises);

            const linkedModels: Models[] = [];

            for (const model of models) {
                if (!model) continue;

                const linkedBodyTypes = [];
                for (const bodyTypeId of bodyTypeIds) {
                    const bodyType = bodyTypes.find((b) => b.bodyTypeId === bodyTypeId);
                    if (!bodyType) continue;

                    if (model.bodyTypes.some((existingBodyType: any) => existingBodyType.bodyTypeId === bodyTypeId)) continue;

                    linkedBodyTypes.push(bodyType);
                }

                if (linkedBodyTypes.length) {
                    model.bodyTypes.push(...linkedBodyTypes);
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

    static async associateModelTransmission(req: Request, res: Response) {
        const { modelIds, transmissionIds } = req.body;

        if (!modelIds || !transmissionIds || !modelIds.length || !transmissionIds.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const modelsRepository: Repository<Models> = getRepository(Models);
        const transmissionsRepository: Repository<Transmissions> = getRepository(Transmissions);

        try {
            const modelsPromises = modelIds.map((modelId: number) =>
                modelsRepository.findOne({
                    where: { modelId },
                    relations: ["transmissions"],
                })
            );
            const models = await Promise.all(modelsPromises);

            const transmissionsPromises = transmissionIds.map((transmissionId: number) =>
                transmissionsRepository.findOne({ where: { transmissionId } })
            );
            const transmissions = await Promise.all(transmissionsPromises);

            const linkedModels: Models[] = [];

            for (const model of models) {
                if (!model) continue;

                const linkedTransmissions = [];
                for (const transmissionId of transmissionIds) {
                    const transmission = transmissions.find((t) => t.transmissionId === transmissionId);
                    if (!transmission) continue;

                    if (model.transmissions.some((existingTransmission: any) => existingTransmission.transmissionId === transmissionId)) continue;

                    linkedTransmissions.push(transmission);
                }

                if (linkedTransmissions.length) {
                    model.transmissions.push(...linkedTransmissions);
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

    static async associateModelColor(req: Request, res: Response) {
        const { modelIds, colorIds } = req.body;

        if (!modelIds || !colorIds || !modelIds.length || !colorIds.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const modelsRepository: Repository<Models> = getRepository(Models);
        const colorsRepository: Repository<Color> = getRepository(Color);

        try {
            const modelsPromises = modelIds.map((modelId: number) =>
                modelsRepository.findOne({
                    where: { modelId },
                    relations: ["colors"],
                })
            );
            const models = await Promise.all(modelsPromises);

            const colorsPromises = colorIds.map((colorId: number) =>
                colorsRepository.findOne({ where: { colorId } })
            );
            const colors = await Promise.all(colorsPromises);

            const linkedModels: Models[] = [];

            for (const model of models) {
                if (!model) continue;

                const linkedColors = [];
                for (const colorId of colorIds) {
                    const color = colors.find((c) => c.colorId === colorId);
                    if (!color) continue;

                    if (model.colors.some((existingColor: any) => existingColor.colorId === colorId)) continue;

                    linkedColors.push(color);
                }

                if (linkedColors.length) {
                    model.colors.push(...linkedColors);
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
