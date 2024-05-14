import { Router } from "express";
import { ListingsController }  from "../controllers/listings/listings";
import {checkAccessToken} from "../middleware/auth-middleware";

const listingsRouter = Router();

const LISTINGS: '/listings' = '/listings';

listingsRouter.post(LISTINGS + '/add', checkAccessToken, ListingsController.createListing);
listingsRouter.post(LISTINGS + '/', ListingsController.getListings);
listingsRouter.get(LISTINGS + '/statuses', ListingsController.getListingsStatuses);
listingsRouter.patch(LISTINGS + '/status', checkAccessToken, ListingsController.updateListingStatus);


listingsRouter.get(LISTINGS + '/:id', ListingsController.getListingById);
listingsRouter.put(LISTINGS + '/:id', ListingsController.updateListing);
listingsRouter.delete(LISTINGS + '/:id', ListingsController.deleteListing);
export default listingsRouter;
