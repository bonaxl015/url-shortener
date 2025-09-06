-- CreateTable
CREATE TABLE "public"."ShortUrl" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" CHAR(8) NOT NULL,
    "originalUrl" VARCHAR(255) NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_code_key" ON "public"."ShortUrl"("code");
