-- CreateTable: Add Group model for WhatsApp group spaces
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT,
    "code_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_slug_key" ON "Group"("slug");

-- CreateIndex
CREATE INDEX "Group_slug_idx" ON "Group"("slug");

-- AlterTable: Add group_id to Opdracht
-- First add as nullable, then we'll create a default group and update existing records
ALTER TABLE "Opdracht" ADD COLUMN "group_id" TEXT;

-- Create a default group for existing opdrachten
INSERT INTO "Group" ("id", "slug", "name", "created_at")
VALUES ('default-group-id', 'algemeen', 'Algemeen Overzicht', CURRENT_TIMESTAMP);

-- Assign all existing opdrachten to the default group
UPDATE "Opdracht" SET "group_id" = 'default-group-id' WHERE "group_id" IS NULL;

-- Make group_id required now that all records have it
ALTER TABLE "Opdracht" ALTER COLUMN "group_id" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "Opdracht" ADD CONSTRAINT "Opdracht_group_id_fkey"
FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Opdracht_group_id_idx" ON "Opdracht"("group_id");
