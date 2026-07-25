import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database with sample leads...");

  // Clear existing leads
  await prisma.lead.deleteMany();

  const sampleLeads = [
    {
      name: "Sarah Jenkins",
      email: "sarah.jenkins@acmecorp.com",
      budgetRange: "$10,000 - $25,000",
      message: "We are looking for a complete redesign of our enterprise SaaS platform marketing site and client dashboard integration.",
      status: "NEW" as const,
    },
    {
      name: "Marcus Vance",
      email: "marcus@vancemedia.io",
      budgetRange: "$5,000 - $10,000",
      message: "Interested in setting up a custom lead management funnel with automated CRM synchronization for our sales team.",
      status: "CONTACTED" as const,
    },
    {
      name: "Elena Rostova",
      email: "elena.rostova@techinnovations.org",
      budgetRange: "$25,000+",
      message: "Need a full-stack Next.js and Tailwind web application built with high security and sub-second page performance.",
      status: "CLOSED" as const,
    },
    {
      name: "David Kim",
      email: "david.kim@fintechlabs.co",
      budgetRange: "$1,000 - $5,000",
      message: "Looking for an expert team to build a high-converting landing page for our upcoming product launch event.",
      status: "NEW" as const,
    },
  ];

  for (const lead of sampleLeads) {
    await prisma.lead.create({
      data: lead,
    });
  }

  console.log(`Successfully seeded ${sampleLeads.length} leads!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
