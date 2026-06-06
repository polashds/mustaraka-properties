-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('Apartment', 'House', 'Commercial', 'Land');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('Sale', 'Rent');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('Draft', 'Published');

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "type" "PropertyType" NOT NULL,
    "listingType" "ListingType" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'Draft',
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" DOUBLE PRECISION,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "hot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- AddForeignKey
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
