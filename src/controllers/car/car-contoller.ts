import { Request, Response } from 'express';
import { CarService } from '../../services/car-services';

export class CarController {
    static async createCar(req: Request, res: Response) {
        try {
            const car = await CarService.createCar(req.body);
            res.status(201).json({car, success: true});
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllCars(req: Request, res: Response) {
        try {
            const cars = await CarService.getAllCars();
            res.json({cars, success: true});
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getCarById(req: Request, res: Response) {
        try {
            const car = await CarService.getCarById(parseInt(req.params.id));
            if (!car) {
                return res.status(404).json({ message: 'Car not found' });
            }
            res.json({car, success: true});
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateCar(req: Request, res: Response) {
        try {
            const updated = await CarService.updateCar(parseInt(req.params.id), req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Car not found' });
            }
            res.json({updated, success: true});
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteCar(req: Request, res: Response) {
        try {
            const result = await CarService.deleteCar(parseInt(req.params.id));
            if (!result) {
                return res.status(404).json({ message: 'Car not found' });
            }
            res.status(204).json({ message: 'Car deleted' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
