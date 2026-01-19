-- CreateTable
CREATE TABLE "Kandidaat" (
    "id" TEXT NOT NULL,
    "naam" TEXT NOT NULL,
    "hoofdskill" TEXT NOT NULL,
    "skills" TEXT,
    "whatsapp_nummer" TEXT NOT NULL,
    "beschikbaar" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kandidaat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Kandidaat_beschikbaar_idx" ON "Kandidaat"("beschikbaar");
