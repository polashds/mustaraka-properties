import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "market-insights" },
    update: {},
    create: { name: "Market Insights", slug: "market-insights" },
  });

  const post = await prisma.post.upsert({
    where: { slug: "dhaka-real-estate-market-2026" },
    update: {},
    create: {
      title: "Dhaka Real Estate Market: What to Expect in 2026",
      slug: "dhaka-real-estate-market-2026",
      excerpt:
        "Demand is rising, supply is tightening, and interest rates are shifting. Here is what buyers, sellers, and investors need to know about Dhaka's property market this year.",
      featuredImage:
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
      status: "Published",
      categoryId: category.id,
      body: `## Overview

After a period of recalibration in 2024–25, Dhaka's residential property market is entering 2026 with renewed momentum. Rising middle-class demand, improving infrastructure in peripheral areas, and a shortage of quality stock in established neighbourhoods are all contributing to upward price pressure — particularly in the mid-to-premium segment.

This guide breaks down the key trends, the most active areas, and what buyers and investors should be watching closely.

---

## Key Trends

### 1. Premium Stock Remains Undersupplied

High-quality apartments in Gulshan, Banani, Baridhara, and Bashundhara continue to see strong demand from both owner-occupiers and investors. Developers have been slow to add new premium inventory, which is keeping prices firm and vacancy rates low.

**What this means for buyers:** If you are targeting a Grade A apartment in a prime location, act early. Prices are unlikely to soften significantly, and competition for well-finished units is intense.

### 2. Mirpur and Mohammadpur Gaining Ground

Mid-market buyers are increasingly looking at Mirpur (sections 1, 6, 10, 11, and 12) and Mohammadpur as viable alternatives to the pricier north. Infrastructure improvements — particularly road widening and the expanding metro rail network — have made these areas significantly more accessible.

**What this means for investors:** Rental yields in Mirpur are currently running 5–7%, compared to 3–4.5% in Gulshan, making it an attractive option for yield-focused portfolios.

### 3. Bashundhara R/A Maturing Fast

Five years ago, Bashundhara Residential Area was considered peripheral. Today it is one of the fastest-developing zones in the city. Commercial activity, schools, and healthcare facilities have followed the residential growth, and price appreciation has been among the strongest in the capital.

---

## Price Movements (2025 → 2026)

| Area | Avg. Price/sqft (2025) | Avg. Price/sqft (2026 Est.) | YoY Change |
|---|---|---|---|
| Gulshan 1 & 2 | ৳ 18,000–22,000 | ৳ 19,500–24,000 | +7–9% |
| Banani | ৳ 15,000–19,000 | ৳ 16,000–20,500 | +6–8% |
| Bashundhara R/A | ৳ 9,000–13,000 | ৳ 10,500–14,500 | +10–12% |
| Mirpur (10/11/12) | ৳ 5,500–7,500 | ৳ 6,000–8,200 | +8–10% |
| Mohammadpur | ৳ 6,000–8,000 | ৳ 6,500–8,800 | +7–9% |

*Figures are indicative based on Q1 2026 transaction data and developer pricing.*

---

## What Should Buyers Do Now?

1. **Get pre-qualified early.** Mortgage availability from major banks has improved, but the processing time remains 6–10 weeks. Starting this process before you identify a property saves time.

2. **Prioritise legal due diligence.** Title disputes remain a risk in certain areas — particularly older developments and land-heavy projects. Engage a solicitor to verify ownership chain and check for encumbrances before committing.

3. **Consider the resale horizon.** If you plan to hold for 5+ years, current prices in Mirpur and Bashundhara offer strong appreciation potential. Short-term flipping is harder in a market where transaction costs (registration, mutation) represent 8–12% of the purchase price.

4. **Work with a verified agent.** The Dhaka market has a high proportion of informal intermediaries. Use an agent who can provide references, evidence of past transactions, and a clear fee structure.

---

## Outlook for the Remainder of 2026

We expect the mid-premium segment to continue outperforming. Demand from returning NRBs, a growing corporate rental market, and the steady expansion of the professional class all support continued price appreciation.

One variable to watch is the interest rate environment. If the Bangladesh Bank moves to ease lending rates in H2 2026, mortgage-driven demand could accelerate considerably — particularly for first-time buyers currently sitting on the sidelines.

---

*This analysis is for informational purposes only and does not constitute financial or investment advice. Figures are estimates based on available market data at the time of publication. Contact a Mustaraka Properties advisor for guidance tailored to your situation.*
`,
    },
  });

  console.log(`✓ Post created: "${post.title}" (id: ${post.id})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
