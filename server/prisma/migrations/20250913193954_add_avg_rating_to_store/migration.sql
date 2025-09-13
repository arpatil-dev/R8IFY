-- Add avgRating column to Store if not already added
ALTER TABLE "public"."Store" ADD COLUMN IF NOT EXISTS "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Create trigger function to update avgRating
CREATE OR REPLACE FUNCTION update_store_avg()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "public"."Store"
  SET "avgRating" = (
    SELECT COALESCE(AVG(r.value), 0)
    FROM "public"."Rating" r
    WHERE r."storeId" = COALESCE(NEW."storeId", OLD."storeId")
  )
  WHERE id = COALESCE(NEW."storeId", OLD."storeId");

  -- Handle return values based on operation
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop old triggers if they exist (prevent duplicates)
DROP TRIGGER IF EXISTS rating_inserted ON "public"."Rating";
DROP TRIGGER IF EXISTS rating_updated ON "public"."Rating";
DROP TRIGGER IF EXISTS rating_deleted ON "public"."Rating";

-- Trigger on INSERT
CREATE TRIGGER rating_inserted
AFTER INSERT ON "public"."Rating"
FOR EACH ROW EXECUTE FUNCTION update_store_avg();

-- Trigger on UPDATE
CREATE TRIGGER rating_updated
AFTER UPDATE ON "public"."Rating"
FOR EACH ROW EXECUTE FUNCTION update_store_avg();

-- Trigger on DELETE
CREATE TRIGGER rating_deleted
AFTER DELETE ON "public"."Rating"
FOR EACH ROW EXECUTE FUNCTION update_store_avg();
