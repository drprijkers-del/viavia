-- CreateTable
CREATE TABLE "Opdracht" (
    "id" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "omschrijving" TEXT NOT NULL,
    "locatie" TEXT NOT NULL DEFAULT 'Remote',
    "plaats" TEXT,
    "hybride_dagen_per_week" INTEGER,
    "uurtarief_min" INTEGER,
    "uurtarief_max" INTEGER,
    "valuta" TEXT NOT NULL DEFAULT 'EUR',
    "startdatum" TEXT,
    "duur" TEXT,
    "inzet" TEXT,
    "tags" TEXT,
    "plaatser_naam" TEXT NOT NULL,
    "plaatser_whatsapp" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "edit_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opdracht_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reactie" (
    "id" TEXT NOT NULL,
    "opdracht_id" TEXT NOT NULL,
    "naam" TEXT NOT NULL,
    "bericht" TEXT,
    "whatsapp_nummer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reactie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Opdracht_edit_token_key" ON "Opdracht"("edit_token");

-- CreateIndex
CREATE INDEX "Opdracht_status_idx" ON "Opdracht"("status");

-- CreateIndex
CREATE INDEX "Opdracht_created_at_idx" ON "Opdracht"("created_at");

-- CreateIndex
CREATE INDEX "Reactie_opdracht_id_idx" ON "Reactie"("opdracht_id");

-- AddForeignKey
ALTER TABLE "Reactie" ADD CONSTRAINT "Reactie_opdracht_id_fkey" FOREIGN KEY ("opdracht_id") REFERENCES "Opdracht"("id") ON DELETE CASCADE ON UPDATE CASCADE;

