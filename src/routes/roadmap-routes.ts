// src/routes/roadmap-routes.ts
import { Router } from 'express';
import { RoadmapController } from '../controllers/roadmap/roadmap-controller';
import { checkAccessToken } from '../middleware/auth-middleware';

const roadmapRouter = Router();

const ROADMAPS = '/roadmaps';

roadmapRouter.post(ROADMAPS + '/add', checkAccessToken, RoadmapController.createOrLinkCar);
roadmapRouter.get(ROADMAPS, RoadmapController.getAllRoadmaps);
roadmapRouter.post(ROADMAPS + '/user', checkAccessToken, RoadmapController.getRoadmapsByUserId);
roadmapRouter.get(ROADMAPS + '/:id', RoadmapController.getRoadmapById);
roadmapRouter.put(ROADMAPS + '/:id', checkAccessToken, RoadmapController.updateRoadmap);
roadmapRouter.delete(ROADMAPS + '/:id', checkAccessToken, RoadmapController.deleteRoadmap);

export default roadmapRouter;
