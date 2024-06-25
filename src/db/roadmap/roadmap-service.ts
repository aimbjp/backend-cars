// src/services/roadmap-services.ts
import { query } from '../connection/database';

export class RoadmapService {
    static async createOrLinkCar(carData: any, userId: number) {
        const { model_id, engine_id, transmission_id, drive_id, year, body_type_id, color_id, name, description, media_url, next_car_id, prev_car_id } = carData;

        // Проверка наличия машины в базе
        const existingCar = await query(
            `SELECT car_id FROM cars WHERE model_id = $1 AND engine_id = $2 AND transmission_id = $3 AND drive_id = $4 AND year = $5 AND body_type_id = $6 AND color_id = $7`,
            [model_id, engine_id, transmission_id, drive_id, year, body_type_id, color_id]
        );

        let carId;
        if (existingCar.rows.length > 0) {
            carId = existingCar.rows[0].car_id;
        } else {
            const newCar = await query(
                `INSERT INTO cars (model_id, engine_id, transmission_id, drive_id, year, body_type_id, color_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                     RETURNING car_id`,
                [model_id, engine_id, transmission_id, drive_id, year, body_type_id, color_id]
            );
            carId = newCar.rows[0].car_id;
        }

        // Добавление записи в таблицу планирования автомобилей
        const { rows } = await query(
            `INSERT INTO planing_car (car_id, user_id, name, description, media_url, next_car_id, prev_car_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
            [carId, userId, name, description, media_url, next_car_id, prev_car_id]
        );

        return rows[0];
    }

    static async getAllRoadmaps(): Promise<any[]> {
        const { rows } = await query(`SELECT * FROM planing_car`);
        return rows;
    }

    static async getRoadmapById(roadmap_id: number): Promise<any | null> {
        const { rows } = await query(`SELECT * FROM planing_car WHERE roadmap_id = $1`, [roadmap_id]);
        return rows[0] || null;
    }

    static async updateRoadmap(roadmap_id: number, roadmapData: any): Promise<any | null> {
        const updateFields = Object.keys(roadmapData).map((field, index) => `${field} = $${index + 1}`).join(', ');
        const values = Object.values(roadmapData);
        values.push(roadmap_id);

        const { rows } = await query(
            `UPDATE planing_car SET ${updateFields} WHERE roadmap_id = $${values.length} RETURNING *`,
            values
        );

        return rows[0] || null;
    }

    static async deleteRoadmap(roadmap_id: number): Promise<boolean> {
        const result = await query(`DELETE FROM planing_car WHERE roadmap_id = $1`, [roadmap_id]);
        return result.rowCount! > 0;
    }

    static async getRoadmapsByUserId(userId: number): Promise<any[]> {
        const { rows } = await query(`SELECT * FROM planing_car WHERE user_id = $1`, [userId]);
        return rows;
    }
}
