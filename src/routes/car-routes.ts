import { Router } from 'express';
import { CarController } from '../controllers/car/car-contoller';
import {DrivesController} from "../controllers/car/drives-controller";
import {EnginesController} from "../controllers/car/engines-controller";
import {BodyTypeController} from "../controllers/car/body-type-controller";
import {ModelsController} from "../controllers/car/models-controller";
import {ColorsController} from "../controllers/car/color-controller";
import {TransmissionsController} from "../controllers/car/transmissions-controller";
import {BrandsController} from "../controllers/car/brands-controller";
import {AssociatesController} from "../controllers/car/associates-controller";

const carsRouter = Router();

const CARS: '/cars' = '/cars';
const DRIVES: '/drives' = '/drives';
const ENGINES: '/engines' = '/engines';
const BRANDS: '/brands' = '/brands';
const COLORS: '/colors' = '/colors';
const TRANSMISSIONS: '/transmissions' = '/transmissions';
const BODYTYPES: '/bodytypes' = '/bodytypes';
const MODELS: '/models' = '/models';
const ASSOCIATE: '/associate' = '/associate';


carsRouter.post(CARS + '/', CarController.createCar);
carsRouter.get(CARS + '/', CarController.getAllCars);
carsRouter.get(CARS + '/:id', CarController.getCarById);
carsRouter.put(CARS + '/:id', CarController.updateCar);
carsRouter.delete(CARS + '/:id', CarController.deleteCar);


carsRouter.get(DRIVES + '/', DrivesController.getAllDrives);
carsRouter.get(DRIVES + '/:id', DrivesController.getDriveById);
carsRouter.post(DRIVES + '/modelId', DrivesController.getDrivesByModelId);
carsRouter.post(DRIVES + '/', DrivesController.createDrive);
carsRouter.put(DRIVES + '/:id', DrivesController.updateDrive);
carsRouter.delete(DRIVES + '/:id', DrivesController.deleteDrive);

carsRouter.get(ENGINES + '/', EnginesController.getAllEngines);
carsRouter.get(ENGINES + '/:id', EnginesController.getEngineById);
carsRouter.post(ENGINES + '/modelId', EnginesController.getEnginesByModelId);
carsRouter.post(ENGINES + '/', EnginesController.createEngine);
carsRouter.put(ENGINES + '/:id', EnginesController.updateEngine);
carsRouter.delete(ENGINES + '/:id', EnginesController.deleteEngine);

carsRouter.get(BRANDS + '/', BrandsController.getAllBrands);
carsRouter.get(BRANDS + '/:id', BrandsController.getBrandById);
carsRouter.post(BRANDS + '/', BrandsController.createBrand);
carsRouter.put(BRANDS + '/:id', BrandsController.updateBrand);
carsRouter.delete(BRANDS + '/:id', BrandsController.deleteBrand);

carsRouter.get(COLORS + '/', ColorsController.getAllColors);
carsRouter.get(COLORS + '/:id', ColorsController.getColorById);
carsRouter.post(COLORS + '/modelId', ColorsController.getColorsByModelId);
carsRouter.post(COLORS + '/', ColorsController.createColor);
carsRouter.put(COLORS + '/:id', ColorsController.updateColor);
carsRouter.delete(COLORS + '/:id', ColorsController.deleteColor);

carsRouter.get(TRANSMISSIONS + '/', TransmissionsController.getAllTransmissions);
carsRouter.get(TRANSMISSIONS + '/:id', TransmissionsController.getTransmissionById);
carsRouter.post(TRANSMISSIONS + '/modelId', TransmissionsController.getTransmissionsByModelId);
carsRouter.post(TRANSMISSIONS + '/', TransmissionsController.createTransmission);
carsRouter.put(TRANSMISSIONS + '/:id', TransmissionsController.updateTransmission);
carsRouter.delete(TRANSMISSIONS + '/:id', TransmissionsController.deleteTransmission);

carsRouter.get(BODYTYPES + '/', BodyTypeController.getAllBodyTypes);
carsRouter.get(BODYTYPES + '/:id', BodyTypeController.getBodyTypeById);
carsRouter.post(BODYTYPES + '/modelId', BodyTypeController.getBodyTypesByModelId);
carsRouter.post(BODYTYPES + '/', BodyTypeController.createBodyType);
carsRouter.put(BODYTYPES + '/:id', BodyTypeController.updateBodyType);
carsRouter.delete(BODYTYPES + '/:id', BodyTypeController.deleteBodyType);

carsRouter.get(MODELS + '/', ModelsController.getAllModels);
carsRouter.get(MODELS + '/:id', ModelsController.getModelById);
carsRouter.post(MODELS + '/brandId', ModelsController.getModelsByBrandId);
carsRouter.post(MODELS + '/', ModelsController.createModel);
carsRouter.put(MODELS + '/:id', ModelsController.updateModel);
carsRouter.delete(MODELS + '/:id', ModelsController.deleteModel);
carsRouter.get(MODELS + '-without-brand', ModelsController.getModelsWithoutBrand);


carsRouter.post(ASSOCIATE + '/model-brand', ModelsController.getModelsWithoutBrand);
carsRouter.post(ASSOCIATE + '/model-engine', AssociatesController.associateModelEngine);
carsRouter.post(ASSOCIATE + '/model-drive', AssociatesController.associateModelDrive);
carsRouter.post(ASSOCIATE + '/model-body-type', AssociatesController.associateModelBodyType);
carsRouter.post(ASSOCIATE + '/model-transmission', AssociatesController.associateModelTransmission);
carsRouter.post(ASSOCIATE + '/model-color', AssociatesController.associateModelColor);




export default carsRouter;


