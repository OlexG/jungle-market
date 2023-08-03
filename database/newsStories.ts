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
        companyId: company.id,
        title: "News Story",
        description: "Wowiie, this company did something",
        image: "https://google.com",
        createdAt: new Date().getTime().toString(),
      },
    });
  }

  static async findBycompanyId(companyId: string) {
    return await db.newsStories.findMany({
      where: { companyId: companyId },
    });
  }

  static async findById(id: string) {
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

  static async getNewsByPage() {
    const newsStories = await db.newsStories.findMany({});
    // TODO: add pagination
    return newsStories;
  }
}

// Generate a news story for a random company every minute
setInterval(async () => {
  await NewsStories.createNewsStory();
}, 60000);
