import { db } from "./database.ts";

export class NewsStories {
  static async createNewsStory(companyId?: string) {
    // Pick a random company
    let company;
    if (!companyId) {
      company = await db.companies.findFirst({
        where: {},
        skip: Math.floor(Math.random() * 100),
      });
    } else {
      company = await db.companies.findFirst({
        where: { id: companyId },
      });
    }
    
    if (!company) throw new Error("Company not found");
    const id = crypto.randomUUID();
    const newsStory = await db.newsStories.create({
      data: {
        id,
        companyID: company.id,
        title: "News Story",
        description: "Wowiie, this company did something",
        image: "https://google.com",
        createdAt: new Date().getTime().toString(),
      },
    });
  }

  static async getByCompanyId(companyId: string) {
    return await db.newsStories.findMany({
      where: { companyID: companyId },
    });
  }

  static async getById(id: string) {
    return await db.newsStories.findFirst({
      where: { id },
    });
  }

  static async deleteAllRecords() {
    for (const newsStory of await db.newsStories.findMany({})) {
      await db.newsStories.delete({
        where: { id: newsStory.id },
      });
    }
  }
}

// Generate a new story for every company every 10 seconds
setInterval(async () => {
  const companies = await db.companies.findMany({});
  for (const company of companies) {
    await NewsStories.createNewsStory(company.id);
  }
}, 60000);
