import { getDatabase } from '../adapters/sqlite';
import { MedicationAiInformation } from '../models';
import { CreateMedicationAiInformationDTO, UpdateMedicationAiInformationDTO } from '../dto';
import { RecordNotFoundError } from '../helpers/errors';

export class MedicationAiInformationRepository {
    static mapRow(row: Record<string, any>): MedicationAiInformation {
        return {
            id: row.mai_id,
            medicationId: row.mdc_id,
            description: row.mai_description,
            commonUses: row.mai_common_uses,
            contraindications: row.mai_contraindications,
            sideEffects: row.mai_side_effects,
            warnings: row.mai_warnings,
            interactions: row.mai_interactions,
            generatedDatetime: row.mai_generated_datetime
        };
    }

    static async create(data: CreateMedicationAiInformationDTO): Promise<number> {
        const db = getDatabase();
        const now = new Date().toISOString();

        const result = await db.runAsync(
            `INSERT INTO pbt_medication_ai_information (
                mdc_id, mai_description, mai_common_uses, mai_contraindications,
                mai_side_effects, mai_warnings, mai_interactions, mai_generated_datetime
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.medicationId,
                data.description ?? null,
                data.commonUses ?? null,
                data.contraindications ?? null,
                data.sideEffects ?? null,
                data.warnings ?? null,
                data.interactions ?? null,
                now
            ]
        );

        return result.lastInsertRowId;
    }

    static async findByMedicationId(medicationId: number): Promise<MedicationAiInformation | null> {
        const db = getDatabase();
        const row = await db.getFirstAsync<any>(
            `SELECT * FROM pbt_medication_ai_information WHERE mdc_id = ?`,
            [medicationId]
        );
        return row ? this.mapRow(row) : null;
    }

    static async updateByMedicationId(medicationId: number, data: UpdateMedicationAiInformationDTO): Promise<void> {
        const db = getDatabase();
        const current = await this.findByMedicationId(medicationId);
        if (!current) throw new RecordNotFoundError('MedicationAiInformation (medicationId)', medicationId);

        await db.runAsync(
            `UPDATE pbt_medication_ai_information SET
                mai_description = ?,
                mai_common_uses = ?,
                mai_contraindications = ?,
                mai_side_effects = ?,
                mai_warnings = ?,
                mai_interactions = ?
             WHERE mdc_id = ?`,
            [
                data.description !== undefined ? data.description : current.description,
                data.commonUses !== undefined ? data.commonUses : current.commonUses,
                data.contraindications !== undefined ? data.contraindications : current.contraindications,
                data.sideEffects !== undefined ? data.sideEffects : current.sideEffects,
                data.warnings !== undefined ? data.warnings : current.warnings,
                data.interactions !== undefined ? data.interactions : current.interactions,
                medicationId
            ]
        );
    }
}
