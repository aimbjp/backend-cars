import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Listings } from "../../db/entities/Listings";
import {Cars} from "../../db/entities/Cars";
import {calculateTax} from "../../utils/calculate-tax";

export class ListingsController {
    static async getAllListings(req: Request, res: Response) {
        const listingsRepository = getRepository(Listings);
        const listings = await listingsRepository.find();
        res.json({listings, success: true});
    }

    static async getListingById(req: Request, res: Response) {
        const listingsRepository = getRepository(Listings);
        const listing = await listingsRepository.findOne({
            where: {listingId: parseInt(req.params.id)}
        });
        if (listing) {
            res.json({listing, success: true});
        } else {
            res.status(404).json({ message: "Listing not found", success: false });
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
                media_url: images ? images : ['http://pumase.ru/media-listings/default.png']
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
}
