import { getRepository } from "typeorm";
import { Cars } from "../db/entities/Cars";
import {initializeDatabase} from "../db/connection/database";

initializeDatabase();

export class CarService {
    static async createCar(carData: CarData): Promise<Cars> {
        const carRepository = getRepository(Cars);
        const car = carRepository.create(carData);
        await carRepository.save(car);
        return car;
    }

    static async getAllCars(): Promise<Cars[]> {
        const carRepository = getRepository(Cars);
        return carRepository.find();
    }

    static async getCarById(id: number): Promise<Cars | null> {
        const carRepository = getRepository(Cars);
        return carRepository.findOne({
            where: { carId: id }
        });
    }

    static async updateCar(id: number, carData: Partial<CarData>): Promise<Cars | null> {
        const carRepository = getRepository(Cars);
        const car = await carRepository.findOne({ where: { carId: id } });
        if (!car) {
            return null;
        }
        carRepository.merge(car, carData);
        await carRepository.save(car);
        return car;
    }


    static async deleteCar(id: number): Promise<boolean> {
        const carRepository = getRepository(Cars);
        const deleteResult = await carRepository.delete(id);
        return deleteResult.affected !== 0;
    }
}
