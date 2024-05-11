import { Router } from "express";
import { ListingsController }  from "../controllers/listings/listings";

const listingsRouter = Router();

const LISTINGS: '/listings' = '/listings';

listingsRouter.post(LISTINGS + '/add', ListingsController.createListing);
listingsRouter.post(LISTINGS + '/', ListingsController.getListings);


listingsRouter.get(LISTINGS + '/:id', ListingsController.getListingById);
listingsRouter.put(LISTINGS + '/:id', ListingsController.updateListing);
listingsRouter.delete(LISTINGS + '/:id', ListingsController.deleteListing);
export default listingsRouter;
