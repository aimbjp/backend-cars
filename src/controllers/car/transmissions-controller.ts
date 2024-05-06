import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Transmissions } from "../../db/entities/Transmissions";

export class TransmissionsController {
    static async getAllTransmissions(req: Request, res: Response) {
        const transmissionRepository = getRepository(Transmissions);
        const transmissions = await transmissionRepository.find();
        res.json({transmissions, success: true});
    }

    static async getTransmissionById(req: Request, res: Response) {
        const transmissionRepository = getRepository(Transmissions);
        const transmission = await transmissionRepository.findOne({
            where: {transmissionId: parseInt(req.params.id)}
        });
        if (transmission) {
            res.json({transmission, success: true});
        } else {
            res.status(404).json({ message: "Transmission not found" });
        }
    }

    static async createTransmission(req: Request, res: Response) {
        const transmissionRepository = getRepository(Transmissions);
        const transmission = transmissionRepository.create(req.body);
        await transmissionRepository.save(transmission);
        res.status(201).json({transmission, success: true});
    }

    static async updateTransmission(req: Request, res: Response) {
        const transmissionRepository = getRepository(Transmissions);
        const transmission = await transmissionRepository.findOne({
            where: {transmissionId: parseInt(req.params.id)}
        });
        if (transmission) {
            transmissionRepository.merge(transmission, req.body);
            await transmissionRepository.save(transmission);
            res.json({transmission, success: true});
        } else {
            res.status(404).json({ message: "Transmission not found" });
        }
    }

    static async deleteTransmission(req: Request, res: Response) {
        const transmissionRepository = getRepository(Transmissions);
        const result = await transmissionRepository.delete(req.params.id);
        if (result.affected) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Transmission not found" });
        }
    }
}
