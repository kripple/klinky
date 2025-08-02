CREATE TABLE "links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"value" varchar NOT NULL,
	"alias" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "link_value_idx" ON "links" USING btree ("value");--> statement-breakpoint
CREATE UNIQUE INDEX "link_alias_idx" ON "links" USING btree ("alias");--> statement-breakpoint
CREATE INDEX "link_created_at_idx" ON "links" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "link_updated_at_idx" ON "links" USING btree ("updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uuid_idx" ON "users" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "users" USING btree ("created_at");