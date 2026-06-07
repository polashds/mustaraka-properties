import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const property = await prisma.property.upsert({
    where: { slug: "luxury-villa-al-mawaleh" },
    update: {},
    create: {
      title: "Luxury Villa in Al Mawaleh",
      slug: "luxury-villa-al-mawaleh",
      description:
        "An exquisite 5-bedroom villa nestled in the prestigious Al Mawaleh neighbourhood. Featuring soaring ceilings, imported Italian marble flooring, and a private infinity pool overlooking manicured gardens. The open-plan living and dining area flows seamlessly to a covered terrace, perfect for year-round entertaining. The chef's kitchen is equipped with premium appliances and custom cabinetry. Each bedroom suite offers generous wardrobe space and en-suite bathrooms with walk-in showers. A double garage, maid's room, and smart-home system complete this exceptional residence.",
      price: 285000,
      type: "House",
      listingType: "Sale",
      status: "Published",
      bedrooms: 5,
      bathrooms: 5,
      area: 620,
      address: "Street 7, Block 3, Al Mawaleh South",
      city: "Muscat",
      latitude: 23.5726,
      longitude: 58.4192,
      featured: true,
      hot: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
            alt: "Villa exterior with pool",
          },
          {
            url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
            alt: "Open-plan living area",
          },
          {
            url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
            alt: "Modern kitchen",
          },
          {
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
            alt: "Master bedroom suite",
          },
        ],
      },
    },
  });

  console.log(`✓ Property created: "${property.title}" (id: ${property.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
