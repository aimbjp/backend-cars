// src/controllers/roadmap-controller.ts
import { Request, Response } from 'express';
import { RoadmapService } from '../../db/roadmap/roadmap-service';
import {getUserIdFromToken} from "../../middleware/auth-middleware";

export class RoadmapController {
    static async createOrLinkCar(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const userId = getUserIdFromToken(token!);
            const roadmap = await RoadmapService.createOrLinkCar(req.body, userId!);
            res.status(201).json({ roadmap, success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllRoadmaps(req: Request, res: Response) {
        try {
            const roadmaps = await RoadmapService.getAllRoadmaps();
            res.json({ roadmaps, success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getRoadmapById(req: Request, res: Response) {
        try {
            const roadmap = await RoadmapService.getRoadmapById(parseInt(req.params.id));
            if (!roadmap) {
                return res.status(404).json({ message: 'Roadmap not found' });
            }
            res.json({ roadmap, success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateRoadmap(req: Request, res: Response) {
        try {
            const updated = await RoadmapService.updateRoadmap(parseInt(req.params.id), req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Roadmap not found' });
            }
            res.json({ updated, success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteRoadmap(req: Request, res: Response) {
        try {
            const result = await RoadmapService.deleteRoadmap(parseInt(req.params.id));
            if (!result) {
                return res.status(404).json({ message: 'Roadmap not found' });
            }
            res.status(204).json({ message: 'Roadmap deleted' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getRoadmapsByUserId(req: Request, res: Response) {
        try {
            const userId = req.body.userId;
            const roadmaps = await RoadmapService.getRoadmapsByUserId(userId);
            res.json({ roadmaps, success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
