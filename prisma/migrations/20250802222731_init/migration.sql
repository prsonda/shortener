-- CreateIndex
CREATE INDEX "Url_userId_idx" ON "public"."Url"("userId");

-- CreateIndex
CREATE INDEX "Url_deletedAt_idx" ON "public"."Url"("deletedAt");

-- CreateIndex
CREATE INDEX "Url_createdAt_idx" ON "public"."Url"("createdAt");
