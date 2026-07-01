-- CreateTable
CREATE TABLE "UserPresence" (
    "userId" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPresence_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "UserPresence_lastSeen_idx" ON "UserPresence"("lastSeen");
