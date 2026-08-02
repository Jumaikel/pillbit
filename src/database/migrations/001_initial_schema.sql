-- ==========================================
-- PillBit — Modelo de Base de Datos
-- Versión 2.0
-- ==========================================


-- ==========================================
-- TABLA: MEDICATION
-- ==========================================
-- El campo mdc_deleted_datetime implementa soft delete.
-- NULL = activo | NOT NULL = eliminado (visible solo en historial).
-- Las relaciones operacionales se purgan vía trigger (ver al final).
-- ==========================================
CREATE TABLE IF NOT EXISTS pbt_medication (
    mdc_id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    mdc_name                TEXT    NOT NULL,
    mdc_dosage              TEXT    NOT NULL,
    mdc_presentation        TEXT,
    mdc_quantity_available  INTEGER CHECK (mdc_quantity_available  IS NULL OR mdc_quantity_available  >= 0),
    mdc_expiration_date     DATE    NOT NULL,
    mdc_notes               TEXT,
    mdc_photo_path          TEXT,
    mdc_created_datetime    DATETIME NOT NULL,
    mdc_updated_datetime    DATETIME NOT NULL,
    mdc_deleted_datetime    DATETIME,             -- NULL = activo
    mdc_is_discarded        INTEGER  NOT NULL DEFAULT 0 -- 0 = no, 1 = yes
);

CREATE INDEX IF NOT EXISTS idx_pbt_medication_expiration_date ON pbt_medication (mdc_expiration_date);


-- ==========================================
-- TABLA: MEDICATION REMINDER
-- ==========================================
CREATE TABLE IF NOT EXISTS pbt_medication_reminder (
    mdr_id               INTEGER PRIMARY KEY AUTOINCREMENT,
    mdc_id               INTEGER  NOT NULL,
    mdr_reminder_time    TIME     NOT NULL,
    mdr_is_active        INTEGER  NOT NULL DEFAULT 1,
    mdr_created_datetime DATETIME NOT NULL,
    mdr_updated_datetime DATETIME NOT NULL,
    FOREIGN KEY (mdc_id) REFERENCES pbt_medication(mdc_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pbt_medication_reminder_mdc_id ON pbt_medication_reminder (mdc_id);
CREATE INDEX IF NOT EXISTS idx_pbt_medication_reminder_time   ON pbt_medication_reminder (mdr_reminder_time);


-- ==========================================
-- TABLA: MEDICATION AI INFORMATION
-- ==========================================
CREATE TABLE IF NOT EXISTS pbt_medication_ai_information (
    mai_id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    mdc_id                 INTEGER  NOT NULL UNIQUE,
    mai_description        TEXT,
    mai_common_uses        TEXT,
    mai_contraindications  TEXT,
    mai_side_effects       TEXT,
    mai_warnings           TEXT,
    mai_interactions       TEXT,
    mai_generated_datetime DATETIME NOT NULL,
    FOREIGN KEY (mdc_id) REFERENCES pbt_medication(mdc_id) ON DELETE CASCADE
);


-- ==========================================
-- TABLA: EXPIRATION ALERT
-- ==========================================
-- UNIQUE (mdc_id, eal_type) evita alertas duplicadas del mismo tipo
-- por medicamento. Debe regenerarse si cambia mdc_expiration_date.
-- ==========================================
CREATE TABLE IF NOT EXISTS pbt_expiration_alert (
    eal_id             INTEGER PRIMARY KEY AUTOINCREMENT,
    mdc_id             INTEGER  NOT NULL,
    eal_type           TEXT     NOT NULL CHECK (
                           eal_type IN (
                               '30_days_before',
                               '7_days_before',
                               '1_day_before',
                               'expiration_day',
                               'expired'
                           )
                       ),
    eal_alert_datetime DATETIME NOT NULL,
    eal_is_sent        INTEGER  NOT NULL DEFAULT 0,
    eal_sent_datetime  DATETIME,
    FOREIGN KEY (mdc_id) REFERENCES pbt_medication(mdc_id) ON DELETE CASCADE,
    UNIQUE (mdc_id, eal_type)
);

CREATE INDEX IF NOT EXISTS idx_pbt_expiration_alert_mdc_id  ON pbt_expiration_alert (mdc_id);
-- Índice compuesto para consultas periódicas de alertas pendientes
CREATE INDEX IF NOT EXISTS idx_pbt_expiration_alert_pending ON pbt_expiration_alert (eal_is_sent, eal_alert_datetime);


-- ==========================================
-- TABLA: CONSUMPTION RECORD
-- ==========================================
-- mdr_id es nullable: NULL cuando el registro es manual (sin notificación).
-- ==========================================
CREATE TABLE IF NOT EXISTS pbt_consumption_record (
    csr_id                INTEGER PRIMARY KEY AUTOINCREMENT,
    mdc_id                INTEGER  NOT NULL,
    mdr_id                INTEGER,                    -- NULL = registro manual
    csr_scheduled_datetime DATETIME NOT NULL,
    csr_action_datetime   DATETIME NOT NULL,
    csr_status            TEXT     NOT NULL CHECK (
                              csr_status IN ('taken', 'skipped')
                          ),
    csr_quantity_consumed INTEGER  DEFAULT 1,
    csr_notes             TEXT,
    FOREIGN KEY (mdc_id) REFERENCES pbt_medication(mdc_id)        ON DELETE CASCADE,
    FOREIGN KEY (mdr_id) REFERENCES pbt_medication_reminder(mdr_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pbt_consumption_record_mdc_id          ON pbt_consumption_record (mdc_id);
CREATE INDEX IF NOT EXISTS idx_pbt_consumption_record_action_datetime ON pbt_consumption_record (csr_action_datetime);


-- ==========================================
-- TABLA: NOTIFICATION LOG
-- ==========================================
-- Registro histórico de todas las notificaciones enviadas.
-- mdr_id solo aplica para 'dose_reminder'.
-- eal_id solo aplica para 'expiration_warning'.
-- Ambas FKs usan SET NULL para preservar el log aunque se eliminen las relaciones.
-- ==========================================
CREATE TABLE IF NOT EXISTS pbt_notification_log (
    ntf_id                INTEGER PRIMARY KEY AUTOINCREMENT,
    mdc_id                INTEGER,                    -- NULL si el medicamento fue eliminado
    mdr_id                INTEGER,                    -- Solo para dose_reminder
    eal_id                INTEGER,                    -- Solo para expiration_warning
    ntf_type              TEXT     NOT NULL CHECK (
                              ntf_type IN ('dose_reminder', 'expiration_warning', 'low_stock')
                          ),
    ntf_scheduled_datetime DATETIME,
    ntf_sent_datetime     DATETIME NOT NULL,
    ntf_is_opened         INTEGER  DEFAULT 0,
    FOREIGN KEY (mdc_id) REFERENCES pbt_medication(mdc_id)             ON DELETE SET NULL,
    FOREIGN KEY (mdr_id) REFERENCES pbt_medication_reminder(mdr_id)    ON DELETE SET NULL,
    FOREIGN KEY (eal_id) REFERENCES pbt_expiration_alert(eal_id)       ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pbt_notification_log_sent_datetime ON pbt_notification_log (ntf_sent_datetime);


-- ==========================================
-- TABLA: APPLICATION SETTING
-- ==========================================
-- Singleton: CHECK (ast_id = 1) garantiza una única fila.
-- ==========================================
CREATE TABLE IF NOT EXISTS pbt_application_setting (
    ast_id INTEGER PRIMARY KEY CHECK (ast_id = 1),

    -- ── Accesibilidad ─────────────────────────────────────────────────────────
    ast_text_size                    TEXT    NOT NULL DEFAULT 'normal'
        CHECK (ast_text_size IN ('normal', 'large', 'extra_large')),
    ast_is_high_contrast_enabled     INTEGER NOT NULL DEFAULT 0,
    ast_is_text_to_speech_enabled    INTEGER NOT NULL DEFAULT 0,
    ast_is_voice_notification_enabled INTEGER NOT NULL DEFAULT 0,

    -- ── Notificaciones: tipos habilitados ─────────────────────────────────────
    ast_notify_dose_reminder         INTEGER NOT NULL DEFAULT 1,  -- Recordatorio de toma
    ast_notify_expiration_warning    INTEGER NOT NULL DEFAULT 1,  -- Alerta de vencimiento

    -- ── Notificaciones: comportamiento ────────────────────────────────────────
    ast_is_notification_sound_enabled     INTEGER NOT NULL DEFAULT 1,
    ast_is_notification_vibration_enabled INTEGER NOT NULL DEFAULT 1,

    -- ── Apariencia ────────────────────────────────────────────────────────────
    ast_theme                        TEXT    NOT NULL DEFAULT 'system'
        CHECK (ast_theme IN ('light', 'dark', 'system')),

    -- Descuenta automáticamente una unidad de mdc_quantity_available al marcar como "tomado"
    ast_auto_reduce_stock            INTEGER NOT NULL DEFAULT 1,
    -- Genera información de IA automáticamente al guardar un nuevo medicamento
    ast_ai_info_auto_generate        INTEGER NOT NULL DEFAULT 0,

    -- ── Legal / Seguridad ─────────────────────────────────────────────────────
    -- Muestra el aviso de que la app no reemplaza criterio médico profesional
    ast_show_medical_disclaimer      INTEGER NOT NULL DEFAULT 1,

    ast_created_datetime DATETIME NOT NULL,
    ast_updated_datetime DATETIME NOT NULL
);


-- ==========================================
-- TRIGGER: Soft delete en cascada
-- ==========================================
-- Al establecer mdc_deleted_datetime (soft delete), elimina físicamente
-- todas las relaciones operacionales del medicamento:
--   · Recordatorios
--   · Información generada por IA
--   · Registros de consumo
--   · Alertas de vencimiento
--
-- Las entradas en pbt_notification_log no se eliminan; sus FKs
-- quedan en NULL automáticamente por ON DELETE SET NULL.
--
-- El registro en pbt_medication se conserva íntegro para historial.
-- ==========================================
-- Check if trigger exists is not standard in SQLite, so we drop it first.
DROP TRIGGER IF EXISTS trg_pbt_medication_soft_delete;

CREATE TRIGGER trg_pbt_medication_soft_delete
AFTER UPDATE OF mdc_deleted_datetime ON pbt_medication
WHEN NEW.mdc_deleted_datetime IS NOT NULL
 AND OLD.mdc_deleted_datetime IS NULL
BEGIN
    DELETE FROM pbt_medication_reminder       WHERE mdc_id = NEW.mdc_id;
    DELETE FROM pbt_medication_ai_information WHERE mdc_id = NEW.mdc_id;
    DELETE FROM pbt_consumption_record        WHERE mdc_id = NEW.mdc_id;
    DELETE FROM pbt_expiration_alert          WHERE mdc_id = NEW.mdc_id;
END;
