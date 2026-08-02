import { getDatabase } from '../adapters/sqlite';
import { Medication } from '../models';
import { CreateMedicationDTO, UpdateMedicationDTO } from '../dto';
import { RecordNotFoundError } from '../helpers/errors';

export class MedicationRepository {
    private static mapRow(row: Record<string, any>): Medication {
        return {
            id: row.mdc_id,
            name: row.mdc_name,
            dosage: row.mdc_dosage,
            presentation: row.mdc_presentation,
            quantityAvailable: row.mdc_quantity_available,
            expirationDate: row.mdc_expiration_date,
            notes: row.mdc_notes,
            photoPath: row.mdc_photo_path,
            createdDatetime: row.mdc_created_datetime,
            updatedDatetime: row.mdc_updated_datetime,
            deletedDatetime: row.mdc_deleted_datetime,
            isDiscarded: row.mdc_is_discarded === 1
        };
    }

    static async create(data: CreateMedicationDTO): Promise<number> {
        const db = getDatabase();
        const now = new Date().toISOString();

        const result = await db.runAsync(
            `INSERT INTO pbt_medication (
                mdc_name, mdc_dosage, mdc_presentation, mdc_quantity_available, 
                mdc_expiration_date, mdc_notes, 
                mdc_photo_path, mdc_created_datetime, mdc_updated_datetime, mdc_is_discarded
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.name, 
                data.dosage, 
                data.presentation ?? null, 
                data.quantityAvailable ?? null, 
                data.expirationDate, 
                data.notes ?? null, 
                data.photoPath ?? null, 
                now, 
                now,
                data.isDiscarded ? 1 : 0
            ]
        );

        return result.lastInsertRowId;
    }

    static async findById(id: number): Promise<Medication | null> {
        const db = getDatabase();
        const row = await db.getFirstAsync<any>(
            `SELECT * FROM pbt_medication WHERE mdc_id = ? AND mdc_deleted_datetime IS NULL`,
            [id]
        );
        return row ? this.mapRow(row) : null;
    }

    static async update(id: number, data: UpdateMedicationDTO): Promise<void> {
        const db = getDatabase();
        const current = await this.findById(id);
        if (!current) throw new RecordNotFoundError('Medication', id);

        const now = new Date().toISOString();
        
        await db.runAsync(
            `UPDATE pbt_medication SET
                mdc_name = ?,
                mdc_dosage = ?,
                mdc_presentation = ?,
                mdc_quantity_available = ?,
                mdc_expiration_date = ?,
                mdc_notes = ?,
                mdc_photo_path = ?,
                mdc_updated_datetime = ?,
                mdc_deleted_datetime = ?,
                mdc_is_discarded = ?
             WHERE mdc_id = ? AND mdc_deleted_datetime IS NULL`,
            [
                data.name !== undefined ? data.name : current.name,
                data.dosage !== undefined ? data.dosage : current.dosage,
                data.presentation !== undefined ? data.presentation : current.presentation,
                data.quantityAvailable !== undefined ? data.quantityAvailable : current.quantityAvailable,
                data.expirationDate !== undefined ? data.expirationDate : current.expirationDate,
                data.notes !== undefined ? data.notes : current.notes,
                data.photoPath !== undefined ? data.photoPath : current.photoPath,
                now,
                data.deletedDatetime !== undefined ? data.deletedDatetime : current.deletedDatetime,
                data.isDiscarded !== undefined ? (data.isDiscarded ? 1 : 0) : (current.isDiscarded ? 1 : 0),
                id
            ]
        );
    }

    /**
     * Soft deletes a medication
     */
    static async delete(id: number): Promise<void> {
        const db = getDatabase();
        const now = new Date().toISOString();
        
        const result = await db.runAsync(
            `UPDATE pbt_medication SET mdc_deleted_datetime = ? WHERE mdc_id = ? AND mdc_deleted_datetime IS NULL`,
            [now, id]
        );

        if (result.changes === 0) {
            throw new RecordNotFoundError('Medication', id);
        }
    }
}
