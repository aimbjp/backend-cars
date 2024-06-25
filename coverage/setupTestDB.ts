// src/__tests__/setupTestDB.ts
import { createConnection, getConnection } from 'typeorm';

beforeAll(async () => {
    await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'yourpassword',
        database: 'testdb',
        entities: ['src/db/entities/*.ts'],
        synchronize: true, 
    });
});

afterAll(async () => {
    const connection = getConnection();
    if (connection.isConnected) {
        await connection.close();
    }
});
