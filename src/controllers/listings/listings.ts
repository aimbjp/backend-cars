import { Request, Response } from "express";
import {
    Between,
    FindOptionsWhere,
    getRepository,
    In,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThanOrEqual,
    Raw
} from "typeorm";
import { Listings } from "../../db/entities/Listings";
import {Cars} from "../../db/entities/Cars";
import {calculateTax} from "../../utils/calculate-tax";
import { omit } from "lodash";
import {ListStatus} from "../../db/entities/ListStatus";

export class ListingsController {
    static async getListings(req: Request, res: Response) {
        const page = parseInt(req.body.page as string) || 1;
        const limit = parseInt(req.body.limit as string) || 60;
        const sort = req.body.sort as keyof Listings || '';
        const order = (req.body.order as 'ASC' | 'DESC') || 'ASC';

        const priceMin = parseFloat(req.body.priceMin as string);
        const priceMax = parseFloat(req.body.priceMax as string);
        const places = ListingsController.parseStringArray(req.body.places);

        const brandIds = ListingsController.parseNumericArray(req.body.brandIds);
        const modelIds = ListingsController.parseNumericArray(req.body.modelIds);
        const colorIds = ListingsController.parseNumericArray(req.body.colorIds);
        const bodyTypeIds = ListingsController.parseNumericArray(req.body.bodyTypeIds);
        const transmissionTypes = ListingsController.parseStringArray(req.body.transmissionTypes);
        const engineTypes = ListingsController.parseStringArray(req.body.engineTypes);
        const driveTypes = ListingsController.parseStringArray(req.body.driveTypes);

        const listingsRepository = getRepository(Listings);

        const whereConditions: FindOptionsWhere<Listings> = {
            ...( priceMax && { price: LessThanOrEqual(priceMax.toString()) }),
            ...( priceMin  && { price: MoreThanOrEqual(priceMin.toString()) }),
            ...( priceMin && priceMax && { price: Between(priceMin.toString(), priceMax.toString()) }),
            ...(places.length && { place: Raw(alias => `${alias} LIKE ANY (array[${places.map(place => `'${place}'`).join(", ")}])`) })
        };

        const carConditions: FindOptionsWhere<Cars> = {
            ...((brandIds.length > 0) && { model: { brand: { brandId: In(brandIds) } } }),
            ...((modelIds.length > 0) && { model: { modelId: In(modelIds) } }),
            ...((colorIds.length > 0) && { color: { colorId: In(colorIds) } }),
            ...((bodyTypeIds.length > 0) && { bodyType: { bodyTypeId: In(bodyTypeIds) } }),
            ...((transmissionTypes.length > 0) && { transmission: { transmissionId: In(transmissionTypes) } }),
            ...((engineTypes.length > 0) && { engine: { type: In(engineTypes) } }),
            ...((driveTypes.length > 0) && { drive: { type: In(driveTypes) } })
        };

        if (Object.keys(carConditions).length > 0) {
            whereConditions.car = carConditions;
        }

        const [listings, total] = await listingsRepository.findAndCount({
            where: whereConditions,
            take: limit,
            skip: (page - 1) * limit,
            // order: { [sort]: order },
            relations: ["car", "car.model", "car.model.brand", "car.color", "car.bodyType", "car.transmission", "car.engine", "car.drive"]
        });

        res.json({
            data: listings,
            total,
            page,
            last_page: Math.ceil(total / limit),
            success: true,
        });
    }

    static parseNumericArray(input: any): number[] {
        if (Array.isArray(input)) {
            return input.map(Number).filter(Number.isFinite);
        } else if (typeof input === 'string') {
            const parsed = parseInt(input);
            return Number.isFinite(parsed) ? [parsed] : [];
        }
        return [];
    }

    static parseStringArray(input: any): string[] {
        if (Array.isArray(input)) {
            return input.filter((item): item is string => typeof item === 'string');
        } else if (typeof input === 'string') {
            return [input];
        }
        return [];
    }

    static async getListingById(req: Request, res: Response) {
        const listingsRepository = getRepository(Listings);
        try {
            const listing = await listingsRepository.findOne({
                where: { listingId: parseInt(req.params.id) },
                relations: [
                    "car",
                    "car.model",
                    "car.model.brand",
                    "car.bodyType",
                    "car.color",
                    "car.drive",
                    "car.engine",
                    "car.transmission",
                    "user",
                    "user.contactInfo",
                    "listStatus"
                ]
            });

            if (listing) {
                const listingWithoutVIN = omit(listing, ['VIN']);
                const listingWithoutVINandPTS = omit(listingWithoutVIN, ['pts']);
                res.json({ listing: {...listingWithoutVINandPTS, user: {
                            userId: listingWithoutVINandPTS.user?.id,
                            name: listingWithoutVINandPTS.user?.name,
                            contactInfo: listingWithoutVINandPTS.user?.contactInfo,
                        }}, success: true });
            } else {
                res.status(404).json({ message: "Listing not found", success: false });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error", success: false });
        }
    }

    static async createListing(req: Request, res: Response) {
        const {
            modelId, engineId, transmissionId, driveId, bodyTypeId, colorId, year,
            price, VIN, place, ownersCount, customs, exchange, description, userId, pts, images
        } = req.body;

        try {
            const carsRepository = getRepository(Cars);
            let car = await carsRepository.findOne({
                where: {
                    model: {modelId},
                    engine: {engineId},
                    transmission: {transmissionId},
                    drive: {driveId},
                    bodyType: {bodyTypeId},
                    color: {colorId},
                    year,
                },
                relations: ["listings"]
            });

            if (!car) {
                car = carsRepository.create({
                    model: {modelId},
                    engine: {engineId},
                    transmission: {transmissionId},
                    drive: {driveId},
                    bodyType: {bodyTypeId},
                    color: {colorId},
                    year
                });
                await carsRepository.save(car);
            }

            const listingsRepository = getRepository(Listings);
            const tax = calculateTax(price).toString();

            const listing = listingsRepository.create({
                car,
                price,
                tax,
                pts,
                VIN,
                place,
                ownersCount,
                customs,
                exchange,
                description,
                user: userId,
                datePosted: new Date(),
                views: 0,
                listStatus: {listStatusId: 1},
                media_url: images && images.length > 0 ? images : ['http://pumase.ru/media-listings/default.png']
            });

            await listingsRepository.save(listing);
            res.status(201).json({listing, success: true});
        } catch (error) {
            console.error('Error creating listing:', error);
            res.status(500).json({ message: 'Internal server error', success: false});
        }
    }

    static async updateListing(req: Request, res: Response) {
        const listingsRepository = getRepository(Listings);
        const listing = await listingsRepository.findOne({
            where: {listingId: parseInt(req.params.id)}
        });
        if (listing) {
            listingsRepository.merge(listing, req.body);
            await listingsRepository.save(listing);
            res.json({listing, success: true});
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    }

    static async deleteListing(req: Request, res: Response) {
        const listingsRepository = getRepository(Listings);
        const result = await listingsRepository.delete(req.params.id);
        if (result.affected) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    }

    static async getListingsStatuses(req: Request, res: Response) {
        const listingsStatusesRepository = getRepository(ListStatus);

        try {
            const result = await listingsStatusesRepository.find();

            if (result) {
                res.json({ listingsStatuses: result, success: true });
            } else {
                res.status(404).json({ message: "Listing statuses not found", success: false });
            }
        } catch (error) {
            console.error("Error fetching listing statuses:", error);
            res.status(500).json({ message: "Internal server error", success: false });
        }
    }

    static async updateListingStatus(req: Request, res: Response) {
        const { listingId, statusId } = req.body;

        if (!listingId || !statusId) {
            return res.status(400).json({ message: "Listing ID and Status ID are required", success: false });
        }

        const listingsRepository = getRepository(Listings);
        const listStatusRepository = getRepository(ListStatus);

        try {
            const listing = await listingsRepository.findOne({ where: { listingId } });
            const status = await listStatusRepository.findOne({ where: { listStatusId: statusId } });

            if (!listing || !status) {
                return res.status(404).json({ message: "Listing or Status not found", success: false });
            }

            listing.listStatus = status;
            await listingsRepository.save(listing);

            res.json({ listing, success: true });
        } catch (error) {
            console.error("Error updating listing status:", error);
            res.status(500).json({ message: "Internal server error", success: false });
        }
    }
}
