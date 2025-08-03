DROP INDEX "uuid_idx";--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "link_uuid_idx" ON "links" USING btree ("uuid");--> statement-breakpoint
CREATE UNIQUE INDEX "user_uuid_idx" ON "users" USING btree ("uuid");--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_uuid_unique" UNIQUE("uuid");