-- CreateTable
CREATE TABLE "StripeCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_userId_key" ON "StripeCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_stripeId_key" ON "StripeCustomer"("stripeId");
