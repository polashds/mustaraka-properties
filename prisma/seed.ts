import { PrismaClient, PropertyType, ListingType, PropertyStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const properties = [
  {
    title: "Imperium Eskaton — Premium 3-Bed Apartment",
    slug: "imperium-eskaton-premium-3bed-apartment",
    description:
      "A landmark high-rise in the prestigious Eskaton Garden corridor. Imperium delivers floor-to-ceiling glazing, Italian marble finishes, and a rooftop sky lounge — all minutes from Gulshan 1 and Banglamotor. Each apartment features a private balcony overlooking the city skyline.",
    price: 18500000,
    type: PropertyType.Apartment,
    listingType: ListingType.Sale,
    status: PropertyStatus.Published,
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    address: "Eskaton Garden Road, Eskaton, Dhaka 1000",
    city: "Dhaka",
    latitude: 23.7415,
    longitude: 90.3963,
    featured: true,
    hot: true,
    images: [
      {
        url: "/assets/Assets/Imperium%20EsKaton/Screenshot%202026-04-16%20061101.png",
        alt: "Imperium Eskaton exterior facade",
      },
      {
        url: "/assets/Assets/Imperium%20EsKaton/Screenshot%202026-04-16%20061150.png",
        alt: "Imperium Eskaton living area",
      },
      {
        url: "/assets/Assets/Imperium%20EsKaton/Screenshot%202026-04-16%20061206.png",
        alt: "Imperium Eskaton kitchen and dining",
      },
      {
        url: "/assets/Assets/Imperium%20EsKaton/Screenshot%202026-04-16%20061231.png",
        alt: "Imperium Eskaton master bedroom",
      },
    ],
  },
  {
    title: "Banasree Techkapra — Contemporary Apartment",
    slug: "banasree-techkapra-contemporary-apartment",
    description:
      "Nestled in the rapidly evolving Banasree township, Techkapra offers smart-home-ready apartments with open-plan layouts, high-speed elevator access, and a dedicated parking podium. Ideal for families seeking connectivity to Rampura and Gulshan 2 without the premium price tag.",
    price: 9200000,
    type: PropertyType.Apartment,
    listingType: ListingType.Sale,
    status: PropertyStatus.Published,
    bedrooms: 3,
    bathrooms: 2,
    area: 1380,
    address: "Block D, Banasree, Rampura, Dhaka 1219",
    city: "Dhaka",
    latitude: 23.7473,
    longitude: 90.4318,
    featured: false,
    hot: true,
    images: [
      {
        url: "/assets/Assets/Banasree%20Techkapra/Screenshot%202026-04-16%20175434.png",
        alt: "Banasree Techkapra building exterior",
      },
      {
        url: "/assets/Assets/Banasree%20Techkapra/Screenshot%202026-04-16%20175524.png",
        alt: "Banasree Techkapra interior view",
      },
      {
        url: "/assets/Assets/Banasree%20Techkapra/Screenshot%202026-04-16%20175623.png",
        alt: "Banasree Techkapra floor plan",
      },
    ],
  },
  {
    title: "Pushpo City — Luxurious Condominium",
    slug: "pushpo-city-luxurious-condominium",
    description:
      "An enclave of refined living within Bashundhara Residential Area, Pushpo City sets the standard for condominium luxury in Dhaka North. Four-bedroom residences feature a double-height entry lobby, designer chef's kitchen, en-suite bathrooms with soaking tubs, and a private rooftop terrace.",
    price: 22000000,
    type: PropertyType.Apartment,
    listingType: ListingType.Sale,
    status: PropertyStatus.Published,
    bedrooms: 4,
    bathrooms: 4,
    area: 2400,
    address: "Block J, Bashundhara Residential Area, Dhaka 1229",
    city: "Dhaka",
    latitude: 23.8238,
    longitude: 90.4249,
    featured: true,
    hot: false,
    images: [
      {
        url: "/assets/Assets/Pushpo%20City%20Luxurious%20Condominium/WhatsApp%20Image%202026-04-06%20at%2015.41.3.jpeg",
        alt: "Pushpo City exterior elevation",
      },
      {
        url: "/assets/Assets/Pushpo%20City%20Luxurious%20Condominium/WhatsApp%20Image%202026-04-06%20at%2015.41.35.jpeg",
        alt: "Pushpo City amenity deck",
      },
      {
        url: "/assets/Assets/Pushpo%20City%20Luxurious%20Condominium/WhatsApp%20Image%202026-04-06%20at%2015.43.08%20-%20Copy.png",
        alt: "Pushpo City living room",
      },
    ],
  },
  {
    title: "Dhaka Western Valley — Residential Apartment",
    slug: "dhaka-western-valley-residential-apartment",
    description:
      "Strategically positioned in Mirpur DOHS, Dhaka Western Valley combines military-grade security with suburban tranquility. Three-bedroom units come with split-system AC, built-in wardrobes, and a community clubhouse featuring a swimming pool and gymnasium. Minutes from the airport expressway.",
    price: 11500000,
    type: PropertyType.Apartment,
    listingType: ListingType.Sale,
    status: PropertyStatus.Published,
    bedrooms: 3,
    bathrooms: 3,
    area: 1650,
    address: "Mirpur DOHS, Section 14, Dhaka 1216",
    city: "Dhaka",
    latitude: 23.8281,
    longitude: 90.3700,
    featured: false,
    hot: false,
    images: [
      {
        url: "/assets/Assets/Dhaka%20Western%20Vally/Picture1.png",
        alt: "Dhaka Western Valley project render",
      },
      {
        url: "/assets/Assets/Dhaka%20Western%20Vally/Screenshot%202026-04-16%20130537.png",
        alt: "Dhaka Western Valley master plan",
      },
      {
        url: "/assets/Assets/Dhaka%20Western%20Vally/Screenshot%202026-04-16%20180249.png",
        alt: "Dhaka Western Valley apartment interior",
      },
    ],
  },
  {
    title: "Eden River City — Waterfront Living",
    slug: "eden-river-city-waterfront-living",
    description:
      "One of Dhaka's boldest riverfront developments, Eden River City occupies a prime stretch of the Buriganga waterfront in Keraniganj. Residents enjoy unobstructed river panoramas, a floating promenade, boat jetty, and access to the city centre via the Keraniganj bridge. A rare chance to own riverside real estate near Dhaka.",
    price: 13500000,
    type: PropertyType.Apartment,
    listingType: ListingType.Sale,
    status: PropertyStatus.Published,
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    address: "Keraniganj Township, Keraniganj, Dhaka 1310",
    city: "Dhaka",
    latitude: 23.7099,
    longitude: 90.3826,
    featured: false,
    hot: true,
    images: [
      {
        url: "/assets/Assets/Eden%20River%20City/WhatsApp%20Image%202026-04-02%20at%2007.48.09.jpeg",
        alt: "Eden River City riverfront view",
      },
      {
        url: "/assets/Assets/Eden%20River%20City/WhatsApp%20Image%202026-04-02%20at%2007.48.10.jpeg",
        alt: "Eden River City building facade",
      },
      {
        url: "/assets/Assets/Eden%20River%20City/WhatsApp%20Image%202026-04-02%20at%2007.48.43.jpeg",
        alt: "Eden River City amenity area",
      },
    ],
  },
  {
    title: "Pushpo Eco City — Sustainable Apartment",
    slug: "pushpo-eco-city-sustainable-apartment",
    description:
      "Dhaka's first LEED-inspired eco-residential community in Aftabnagar. Pushpo Eco City integrates rooftop solar panels, rainwater harvesting, and a tree-lined central boulevard to create a low-carbon neighbourhood without sacrificing comfort. Two-bedroom units are ideal for young professionals and couples.",
    price: 8200000,
    type: PropertyType.Apartment,
    listingType: ListingType.Sale,
    status: PropertyStatus.Published,
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    address: "Aftabnagar, Rampura, Dhaka 1212",
    city: "Dhaka",
    latitude: 23.7554,
    longitude: 90.4468,
    featured: false,
    hot: false,
    images: [
      {
        url: "/assets/Assets/Pushpo%20Eco%20City/Screenshot%202026-04-16%20181135.png",
        alt: "Pushpo Eco City site overview",
      },
      {
        url: "/assets/Assets/Pushpo%20Eco%20City/Screenshot%202026-04-16%20181203.png",
        alt: "Pushpo Eco City green corridor",
      },
      {
        url: "/assets/Assets/Pushpo%20Eco%20City/WhatsApp%20Image%202026-04-06%20at%2015.40.4.jpeg",
        alt: "Pushpo Eco City interior finish",
      },
    ],
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Seeding database...");

    await prisma.propertyImage.deleteMany();
    await prisma.property.deleteMany();

    const created = await Promise.all(
      properties.map(({ images, ...data }) =>
        prisma.property.create({ data: { ...data, images: { create: images } } })
      )
    );
    created.forEach((p) => console.log(`  Created: ${p.title}`));

    console.log(`Done — ${properties.length} properties seeded.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
