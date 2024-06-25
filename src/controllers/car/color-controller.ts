import { Request, Response } from "express";
import {getRepository, In} from "typeorm";
import { Color } from "../../db/entities/Color";
import {BodyType} from "../../db/entities/BodyType";

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
        if (!req.body.name) res.status(404).json({ message: "Needed name in body", success: false})

        const colorRepository = getRepository(Color);

        const existingColor = await colorRepository.findOne({ where: { type: req.body.name } });
        if (existingColor) {
            return res.status(201).json({message: 'Color already exists.', engine: existingColor, success: true});
        }

        const color = colorRepository.create({type: req.body.name});
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

    static async getColorsByModelId(req: Request, res: Response) {
        try {
            const { modelId } = req.body;
            if (!modelId) {
                return res.status(400).json({ message: "Model ID is required", success: false });
            }

            const colorRepository = getRepository(Color);
            const whereCondition = Array.isArray(modelId) ?
                { models: { modelId: In(modelId) } } :
                { models: { modelId: modelId } };

            const existingColor = await colorRepository.find({
                where: whereCondition,
                relations: ['models']
            });

            res.json({ colors: existingColor, success: true });
        } catch (error: any) {
            console.error("Failed to fetch colors by model ID:", error);
            res.status(500).send({ message: error.message, success: false });
        }
    }
}
