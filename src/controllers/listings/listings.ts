import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Listings } from "../../db/entities/Listings";

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
            res.status(404).json({ message: "Listing not found" });
        }
    }

    static async createListing(req: Request, res: Response) {
        const listingsRepository = getRepository(Listings);
        const listing = listingsRepository.create(req.body);
        await listingsRepository.save(listing);
        res.status(201).json({listing, success: true});
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
