import { z } from "zod";
import { CompanyDBSchema } from "../routes/models/company.ts";
import { db } from "./database.ts";
import generateRandomArticle from "../generation/articles/articleGeneration.ts";
const MAX_NEW_STORIES = 20;

export class NewsStories {
  static async createNewsStory(company: z.infer<typeof CompanyDBSchema>) {
    
    if (!company) throw new Error("Company not found");
    const id = crypto.randomUUID();
    // rating is between -3 and 3
    const rating = Math.floor(Math.random() * 7) - 3;
    const article = await generateRandomArticle(
      company.name,
      company.ticker,
      company.ceo,
      company.sector,
      rating,
    );

    const newsStory = await db.newsStories.create({
      data: {
        id,
        companyId: company.id,
        title: article.Title,
        description: article.Body,
        image: "https://google.com",
        createdAt: new Date().getTime().toString(),
        author: article.Author,
        rating,
      },
    });

    // Add rating to company
    await db.companies.update({
      where: { id: company.id },
      data: {
        rating: company.rating + rating,
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

      // Remove rating from company
      await db.companies.update({
        where: { id: oldestNewsStory.companyId },
        data: {
          rating: company.rating - oldestNewsStory.rating,
        },
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
  const companies = await db.companies.findMany({});
  if (companies.length === 0) return;
  const company = companies[Math.floor(Math.random() * companies.length)];
  await NewsStories.createNewsStory(company);
}, 60000);
