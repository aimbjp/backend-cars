import "reflect-metadata";
import { createConnection, Connection } from 'typeorm';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export async function initializeDatabase(): Promise<Connection> {
    try {
        const connection = await createConnection({
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            synchronize: false,
            logging: true,
            entities: [
                "dist/db/entities/*.js"
            ],
            migrations: [
                "dist/migration/**/*.js"
            ]
        });
        console.log("Database connection established.");
        return connection;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}


