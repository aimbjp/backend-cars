import { Router } from "express";
import { ListingsController }  from "../controllers/listings/listings";

const listingsRouter = Router();

const LISTINGS: '/listings' = '/listings';

listingsRouter.post(LISTINGS, ListingsController.createListing);

export default listingsRouter;
