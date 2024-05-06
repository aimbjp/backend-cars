import { Router } from 'express';
import * as authController from '../controllers/auth/auth-controller';
import {ListingsController} from "../controllers/listings/listings";

const listingsRoutes = Router();

const LISTINGS: '/listings' = '/listings';

listingsRoutes.get(LISTINGS + '/', ListingsController.getAllListings);
listingsRoutes.get(LISTINGS + '/:id', ListingsController.getListingById);
listingsRoutes.post(LISTINGS + '/', ListingsController.createListing);
listingsRoutes.put(LISTINGS + '/:id', ListingsController.updateListing);
listingsRoutes.delete(LISTINGS + '/:id', ListingsController.deleteListing);

export default listingsRoutes;
