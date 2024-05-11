import { Request, Response } from "express";
import {getRepository, In} from "typeorm";
import { Drives } from "../../db/entities/Drives";
import {BodyType} from "../../db/entities/BodyType";

export class DrivesController {
    static async getAllDrives(req: Request, res: Response) {
        const driveRepository = getRepository(Drives);
        const drives = await driveRepository.find();
        res.json({success: true, drives});
    }

    static async getDriveById(req: Request, res: Response) {
        const driveRepository = getRepository(Drives);
        const drive = await driveRepository.findOne({
            where: {driveId: parseInt(req.params.id)}
        });
        if (drive) {
            res.json({success: true, drive});
        } else {
            res.status(404).json({ message: "Drive not found" });
        }
    }

    static async createDrive(req: Request, res: Response) {
        if (!req.body.name) res.status(404).json({ message: "Needed name in body", success: false})
        const driveRepository = getRepository(Drives);
        const existingDrive = await driveRepository.findOne({ where: { type: req.body.name } });
        if (existingDrive) {
            return res.status(201).json({message: 'Drive already exists.', drive: existingDrive, success: true});
        }
        const drive = driveRepository.create({type: req.body.name});
        await driveRepository.save(drive);
        res.status(201).json({success: true, drive});
    }

    static async updateDrive(req: Request, res: Response) {
        const driveRepository = getRepository(Drives);
        const drive = await driveRepository.findOne({
            where: {driveId: parseInt(req.params.id)}
        });
        if (drive) {
            driveRepository.merge(drive, req.body);
            await driveRepository.save(drive);
            res.json({success: true, drive});
        } else {
            res.status(404).json({ message: "Drive not found" });
        }
    }

    static async deleteDrive(req: Request, res: Response) {
        const driveRepository = getRepository(Drives);
        const result = await driveRepository.delete(req.params.id);
        if (result.affected) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Drive not found" });
        }
    }

    static async getDrivesByModelId(req: Request, res: Response) {
        try {
            const { modelId } = req.body;

            if (!modelId) {
                return res.status(400).json({ message: "Model ID is required", success: false });
            }

            const driveRepository = getRepository(Drives);
            let whereCondition;

            if (Array.isArray(modelId)) {
                whereCondition = { models: { modelId: In(modelId) } };
            } else {
                whereCondition = { models: { modelId: modelId } };
            }

            const existingDrive = await driveRepository.find({
                where: whereCondition,
                relations: ['models']
            });

            res.json({ drives: existingDrive, success: true });
        } catch (error: any) {
            console.error("Failed to fetch drives by model ID:", error);
            res.status(500).send({ message: error.message, success: false });
        }
    }
}
