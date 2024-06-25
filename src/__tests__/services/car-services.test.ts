import 'reflect-metadata';
import { getRepository } from 'typeorm';
import { Cars } from '../../db/entities/Cars';
import { CarService } from '../../services/car-services';

jest.mock('typeorm', () => {
    const actualTypeorm = jest.requireActual('typeorm');
    return {
        ...actualTypeorm,
        getRepository: jest.fn()
    };
});

const mockCarRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
};

describe('CarService', () => {
    const carData = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2021,
        model_id: 1,
        engine_id: 1,
        transmission_id: 1,
        drive_id: 1,
        color: 'Red',
        body_type_id: 1,
        color_id: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getRepository as jest.Mock).mockReturnValue(mockCarRepository);
    });

    describe('createCar', () => {
        it('should create and save a new car', async () => {
            const car = { carId: 1, ...carData };
            mockCarRepository.create.mockReturnValue(car);
            mockCarRepository.save.mockResolvedValue(car);

            const result = await CarService.createCar(carData);

            expect(getRepository).toHaveBeenCalledWith(Cars);
            expect(mockCarRepository.create).toHaveBeenCalledWith(carData);
            expect(mockCarRepository.save).toHaveBeenCalledWith(car);
            expect(result).toEqual(car);
        });
    });

    describe('getAllCars', () => {
        it('should return all cars', async () => {
            const cars = [{ carId: 1, ...carData }];
            mockCarRepository.find.mockResolvedValue(cars);

            const result = await CarService.getAllCars();

            expect(getRepository).toHaveBeenCalledWith(Cars);
            expect(mockCarRepository.find).toHaveBeenCalled();
            expect(result).toEqual(cars);
        });
    });

    describe('getCarById', () => {
        it('should return a car by id', async () => {
            const car = { carId: 1, ...carData };
            mockCarRepository.findOne.mockResolvedValue(car);

            const result = await CarService.getCarById(1);

            expect(getRepository).toHaveBeenCalledWith(Cars);
            expect(mockCarRepository.findOne).toHaveBeenCalledWith({ where: { carId: 1 } });
            expect(result).toEqual(car);
        });

        it('should return null if car is not found', async () => {
            mockCarRepository.findOne.mockResolvedValue(null);

            const result = await CarService.getCarById(1);

            expect(getRepository).toHaveBeenCalledWith(Cars);
            expect(mockCarRepository.findOne).toHaveBeenCalledWith({ where: { carId: 1 } });
            expect(result).toBeNull();
        });
    });

    describe('updateCar', () => {
        // TODO: check car update
        // it('should update and save a car', async () => {
        //     const car = { carId: 1, ...carData };
        //     const updatedCarData = {
        //         make: 'Toyota',
        //         model: 'Camry',
        //         year: 2021,
        //         model_id: 2,
        //         engine_id: 1,
        //         transmission_id: 1,
        //         drive_id: 1,
        //         body_type_id: 1,
        //         color_id: 1,
        //     };
        //     const expectedCar = { ...car, ...updatedCarData };
        //
        //     mockCarRepository.findOne.mockResolvedValue(car);
        //     mockCarRepository.merge.mockReturnValue(expectedCar);
        //     mockCarRepository.save.mockResolvedValue(expectedCar);
        //
        //     const result = await CarService.updateCar(1, updatedCarData);
        //
        //     expect(getRepository).toHaveBeenCalledWith(Cars);
        //     expect(mockCarRepository.findOne).toHaveBeenCalledWith({ where: { carId: 1 } });
        //     expect(mockCarRepository.merge).toHaveBeenCalledWith(car, updatedCarData);
        //     expect(mockCarRepository.save).toHaveBeenCalledWith(expectedCar);
        //     expect(result).toEqual(expectedCar);
        // });

        it('should return null if car is not found', async () => {
            mockCarRepository.findOne.mockResolvedValue(null);

            const result = await CarService.updateCar(1, carData);

            expect(getRepository).toHaveBeenCalledWith(Cars);
            expect(mockCarRepository.findOne).toHaveBeenCalledWith({ where: { carId: 1 } });
            expect(result).toBeNull();
        });
    });

    describe('deleteCar', () => {
        it('should delete a car by id', async () => {
            mockCarRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await CarService.deleteCar(1);

            expect(getRepository).toHaveBeenCalledWith(Cars);
            expect(mockCarRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });

        it('should return false if car is not found', async () => {
            mockCarRepository.delete.mockResolvedValue({ affected: 0 });

            const result = await CarService.deleteCar(1);

            expect(getRepository).toHaveBeenCalledWith(Cars);
            expect(mockCarRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(false);
        });
    });
});
