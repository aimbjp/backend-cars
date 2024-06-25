//
// // Mock data for BodyType
// import {Transmissions} from "../../db/entities/Transmissions";
// import {Cars} from "../../db/entities/Cars";
// import {Role} from "../../db/entities/Role";
// import {Color} from "../../db/entities/Color";
// import {Listings} from "../../db/entities/Listings";
// import {Drives} from "../../db/entities/Drives";
// import {Brands} from "../../db/entities/Brands";
// import {Models} from "../../db/entities/Models";
// import {BodyType} from "../../db/entities/BodyType";
// import {ListStatus} from "../../db/entities/ListStatus";
// import {Users} from "../../db/entities/Users";
// import {Engines} from "../../db/entities/Engines";
// import {ContactInfo} from "../../db/entities/ContactInfo";
//
// export const mockBodyType: BodyType = {
//     bodyTypeId: 1,
//     type: 'Sedan',
//     cars: [],
//     models: []
// };
//
// // Mock data for Color
// export const mockColor: Color = {
//     colorId: 1,
//     type: 'Red',
//     cars: [],
//     models: []
// };
//
// // Mock data for Drives
// export const mockDrive: Drives = {
//     driveId: 1,
//     type: 'AWD',
//     cars: [],
//     models: []
// };
//
// // Mock data for Engines
// export const mockEngine: Engines = {
//     engineId: 1,
//     type: 'V6',
//     capacity: '3.0L',
//     cars: [],
//     models: []
// };
//
// // Mock data for Brands
// export const mockBrand: Brands = {
//     brandId: 1,
//     name: 'Tesla',
//     models: []
// };
//
// // Mock data for Models
// export const mockModel: Models = {
//     modelId: 1,
//     name: 'Model S',
//     brand: mockBrand,
//     bodyTypes: [],
//     colors: [],
//     drives: [],
//     engines: [],
//     transmissions: [],
//     cars: []
// };
//
// // Mock data for Transmissions
// export const mockTransmission: Transmissions = {
//     transmissionId: 1,
//     type: 'Automatic',
//     cars: [],
//     models: []
// };
//
// // Mock data for Cars
// export const mockCar: Cars = {
//     carId: 1,
//     year: 2021,
//     bodyType: mockBodyType,
//     color: mockColor,
//     drive: mockDrive,
//     engine: mockEngine,
//     model: mockModel,
//     transmission: mockTransmission,
//     listings: [],
//     reviews: []
// };
//
// // Mock data for ListStatus
// export const mockListStatus: ListStatus = {
//     listStatusId: 1,
//     type: 'Available',
//     listings: []
// };
//
// // Mock data for ContactInfo
// export const mockContactInfo: ContactInfo = {
//     contactInfoId: 1,
//     contactInfo: {
//         tg: '@johndoe',
//         whatsapp: '123-456-7890',
//         phonePrimary: '123-456-7890',
//         phoneSecondary: '987-654-3210'
//     },
//     users: []
// };
//
// // Mock data for Role
// export const mockRole: Role = {
//     roleId: 1,
//     type: 'admin',
//     users: []
// };
//
// // Mock data for Users
// export const mockUser: Users = {
//     id: 1,
//     email: 'john.doe@example.com',
//     username: 'johndoe',
//     password: 'hashedpassword',
//     name: 'John',
//     surname: 'Doe',
//     contactInfo: mockContactInfo,
//     role: 'admin',
//     rating: 5.0,
//     createdAt: new Date(),
//     role_2: mockRole,
//     listings: [],
//     messages: [],
//     messages2: [],
//     refreshTokens: [],
//     reviews: []
// };
//
// // Mock data for Listings
// export const mockListing: Listings = {
//     listingId: 1,
//     car: mockCar,
//     price: '10000',
//     tax: '1000',
//     pts: '123456',
//     VIN: '1HGBH41JXMN109186',
//     place: 'California',
//     ownersCount: 1,
//     customs: 'Cleared',
//     exchange: false,
//     datePosted: new Date(),
//     views: 0,
//     description: 'A very nice car',
//     media_url: ['http://pumase.ru/media-listings/default.png'],
//     user: mockUser,
//     listStatus: mockListStatus
// };
//
// // Adding references to avoid circular dependencies
// mockBodyType.cars.push(mockCar);
// mockBodyType.models.push(mockModel);
// mockColor.cars.push(mockCar);
// mockColor.models.push(mockModel);
// mockDrive.cars.push(mockCar);
// mockDrive.models.push(mockModel);
// mockEngine.cars.push(mockCar);
// mockEngine.models.push(mockModel);
// mockTransmission.cars.push(mockCar);
// mockTransmission.models.push(mockModel);
// mockModel.cars.push(mockCar);
// mockBrand.models.push(mockModel);
// mockListStatus.listings.push(mockListing);
// mockUser.listings.push(mockListing);
// mockContactInfo.users.push(mockUser);
// mockRole.users.push(mockUser);


import { BodyType } from '../../db/entities/BodyType';
import { Cars } from '../../db/entities/Cars';
import { Color } from '../../db/entities/Color';
import { Drives } from '../../db/entities/Drives';
import { Engines } from '../../db/entities/Engines';
import { Listings } from '../../db/entities/Listings';
import { ListStatus } from '../../db/entities/ListStatus';
import { Models } from '../../db/entities/Models';
import { Role } from '../../db/entities/Role';
import { Transmissions } from '../../db/entities/Transmissions';
import { Users } from '../../db/entities/Users';
import { ContactInfo } from '../../db/entities/ContactInfo';
import {Brands} from "../../db/entities/Brands";

export const mockBodyType: BodyType = {
    bodyTypeId: 1,
    type: 'Sedan',
    cars: [],
    models: [],
};

export const mockColor: Color = {
    colorId: 1,
    type: 'Red',
    cars: [],
    models: [],
};

export const mockDrive: Drives = {
    driveId: 1,
    type: 'AWD',
    cars: [],
    models: [],
};

export const mockEngine: Engines = {
    engineId: 1,
    type: 'V6',
    capacity: '3.0L',
    cars: [],
    models: [],
};

export const mockBrand: Brands = {
    brandId: 1,
    name: 'Tesla',
    models: [],
};

export const mockModel: Models = {
    modelId: 1,
    name: 'Model S',
    brand: mockBrand,
    bodyTypes: [],
    colors: [],
    drives: [],
    engines: [],
    transmissions: [],
    cars: [],
};

export const mockTransmission: Transmissions = {
    transmissionId: 1,
    type: 'Automatic',
    cars: [],
    models: [],
};

export const mockCar: Cars = {
    carId: 1,
    year: 2021,
    bodyType: mockBodyType,
    color: mockColor,
    drive: mockDrive,
    engine: mockEngine,
    model: mockModel,
    transmission: mockTransmission,
    listings: [],
    reviews: [],
};

export const mockListStatus: ListStatus = {
    listStatusId: 1,
    type: 'Available',
    listings: [],
};

export const mockContactInfo: ContactInfo = {
    contactInfoId: 1,
    contactInfo: {
        tg: '@johndoe',
        whatsapp: '123-456-7890',
        phonePrimary: '123-456-7890',
        phoneSecondary: '987-654-3210',
    },
    users: [],
};

export const mockRole: Role = {
    roleId: 1,
    type: 'admin',
    users: [],
};

export const mockUser: Users = {
    id: 1,
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'hashedpassword',
    name: 'John',
    surname: 'Doe',
    contactInfo: mockContactInfo,
    role: 'admin',
    rating: 5.0,
    createdAt: new Date(),
    role_2: mockRole,
    listings: [],
    messages: [],
    messages2: [],
    refreshTokens: [],
    reviews: [],
};

export const mockListing: Listings = {
    listingId: 1,
    car: mockCar,
    price: '10000',
    tax: '1000',
    pts: '123456',
    VIN: '1HGBH41JXMN109186',
    place: 'California',
    ownersCount: 1,
    customs: 'Cleared',
    exchange: false,
    datePosted: new Date(),
    views: 0,
    description: 'A very nice car',
    media_url: ['http://pumase.ru/media-listings/default.png'],
    user: mockUser,
    listStatus: mockListStatus,
};

mockBodyType.cars.push(mockCar);
mockBodyType.models.push(mockModel);
mockColor.cars.push(mockCar);
mockColor.models.push(mockModel);
mockDrive.cars.push(mockCar);
mockDrive.models.push(mockModel);
mockEngine.cars.push(mockCar);
mockEngine.models.push(mockModel);
mockTransmission.cars.push(mockCar);
mockTransmission.models.push(mockModel);
mockModel.cars.push(mockCar);
mockBrand.models.push(mockModel);
mockListStatus.listings.push(mockListing);
mockUser.listings.push(mockListing);
mockContactInfo.users.push(mockUser);
mockRole.users.push(mockUser);
