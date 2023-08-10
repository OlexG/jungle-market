import { db } from "./database.ts";
const MAX_NEW_STORIES = 20;

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
        title: "News Story" + id,
        description: "Wowiie, this company did something",
        image: "https://google.com",
        createdAt: new Date().getTime().toString(),
      },
    });

    // If we are at more than MAX_NEW_STORIES, delete the oldest one
    const newsStories = await db.newsStories.findMany({});
    if (newsStories.length > MAX_NEW_STORIES) {
      const oldestNewsStory = newsStories.reduce((prev, current) => {
        return prev.createdAt < current.createdAt ? prev : current;
      });

      await db.newsStories.delete({
        where: { id: oldestNewsStory.id },
      });
    }

    return newsStory;
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
}, 10000);
