import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Drives } from "../../db/entities/Drives";

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
        const driveRepository = getRepository(Drives);
        const drive = driveRepository.create(req.body);
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
}
