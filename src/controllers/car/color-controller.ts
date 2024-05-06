import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Color } from "../../db/entities/Color";

export class ColorsController {
    static async getAllColors(req: Request, res: Response) {
        const colorRepository = getRepository(Color);
        const colors = await colorRepository.find();
        res.json({colors, success: true});
    }

    static async getColorById(req: Request, res: Response) {
        const colorRepository = getRepository(Color);
        const color = await colorRepository.findOne({
            where: {colorId: parseInt(req.params.id)}
        });
        if (color) {
            res.json({color, success: true});
        } else {
            res.status(404).json({ message: "Color not found" });
        }
    }

    static async createColor(req: Request, res: Response) {
        const colorRepository = getRepository(Color);
        const color = colorRepository.create(req.body);
        await colorRepository.save(color);
        res.status(201).json({color, success: true});
    }

    static async updateColor(req: Request, res: Response) {
        const colorRepository = getRepository(Color);
        const color = await colorRepository.findOne({
            where: {colorId: parseInt(req.params.id)}
        });
        if (color) {
            colorRepository.merge(color, req.body);
            await colorRepository.save(color);
            res.json({color, success: true});
        } else {
            res.status(404).json({ message: "Color not found" });
        }
    }

    static async deleteColor(req: Request, res: Response) {
        const colorRepository = getRepository(Color);
        const result = await colorRepository.delete(req.params.id);
        if (result.affected) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Color not found" });
        }
    }
}
