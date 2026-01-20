-- AlterTable: Simplify Opdracht schema for WhatsApp-style UX

-- Add new required fields with defaults for existing rows
ALTER TABLE "Opdracht"
  ADD COLUMN "bedrijf" TEXT NOT NULL DEFAULT 'Niet opgegeven',
  ADD COLUMN "uurtarief" INTEGER,
  ADD COLUMN "locatie_detail" TEXT,
  ADD COLUMN "uren_per_week" INTEGER,
  ADD COLUMN "duur_maanden" INTEGER,
  ADD COLUMN "teamgrootte" TEXT;

-- Migrate data from old fields to new fields
UPDATE "Opdracht" SET
  uurtarief = COALESCE(uurtarief_min, uurtarief_max, 0),
  locatie_detail = plaats,
  bedrijf = 'Niet opgegeven';

-- Make uurtarief required now that we've set defaults
ALTER TABLE "Opdracht" ALTER COLUMN "uurtarief" SET NOT NULL;

-- Drop old complex fields
ALTER TABLE "Opdracht"
  DROP COLUMN "uurtarief_min",
  DROP COLUMN "uurtarief_max",
  DROP COLUMN "valuta",
  DROP COLUMN "plaats",
  DROP COLUMN "hybride_dagen_per_week",
  DROP COLUMN "startdatum",
  DROP COLUMN "duur",
  DROP COLUMN "inzet",
  DROP COLUMN "tags";
