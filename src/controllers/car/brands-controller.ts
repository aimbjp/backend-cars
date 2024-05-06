import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Brands } from "../../db/entities/Brands";

export class BrandsController {
    static async getAllBrands(req: Request, res: Response) {
        const brandRepository = getRepository(Brands);
        const brands = await brandRepository.find();
        res.json({brands, success: true});
    }

    static async getBrandById(req: Request, res: Response) {
        const brandRepository = getRepository(Brands);
        const brand = await brandRepository.findOne({
            where: { brandId: parseInt(req.params.id)}
        });
        if (brand) {
            res.json({brand, success: true});
        } else {
            res.status(404).json({ message: "Brand not found" });
        }
    }

    static async createBrand(req: Request, res: Response) {
        const brandRepository = getRepository(Brands);
        const brand = brandRepository.create(req.body);
        await brandRepository.save(brand);
        res.status(201).json({brand, success: true});
    }

    static async updateBrand(req: Request, res: Response) {
        const brandRepository = getRepository(Brands);
        const brand = await brandRepository.findOne({
            where: { brandId: parseInt(req.params.id)}
        });
        if (brand) {
            brandRepository.merge(brand, req.body);
            await brandRepository.save(brand);
            res.json({brand, success: true});
        } else {
            res.status(404).json({ message: "Brand not found" });
        }
    }

    static async deleteBrand(req: Request, res: Response) {
        const brandRepository = getRepository(Brands);
        const result = await brandRepository.delete(req.params.id);
        if (result.affected) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Brand not found" });
        }
    }
}
