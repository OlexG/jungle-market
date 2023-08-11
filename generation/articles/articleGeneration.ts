import { generateRandomName } from "../articles/executiveNameGeneration.ts";
import runGPT35Turbo from "../GPT/GPT3.5Turbo.ts";

export function generateArticleTitle(): string {
  return "Glorious Title";
}

async function generateArticleBody(
  companyName: string,
  companyTicker: string,
  CEOName: string,
  industryType: string,
  effect: number,
): Promise<string> {
  const stockChange = stockChangeConverter(effect);
  // Call GPT 3.5 Turbo
  const Turbo_input =
    `The company name is ${companyName} ticker ${companyTicker} which is a company 
     in the ${industryType} industry. The name of the CEO is ${CEOName} and the 
     article should be hinting that the future stock price of ${companyName} will 
     ${stockChange}`;

  const output = await runGPT35Turbo(Turbo_input);
  if(output){
    return output;
  }
  return "Something went wrong";
}

function stockChangeConverter(effect: number): string {
  switch (effect) {
    case -3:
      return "decline dramatically.";
    case -2:
      return "decline significantly.";
    case -1:
      return "decline slightly.";
    case 0:
      return "remain stable.";
    case 1:
      return "increase slightly.";
    case 2:
      return "increase significantly.";
    case 3:
      return "increase dramatically.";
    default:
      return "Stock change effect not recognized.";
  }
}

function generateAuthor(): string {
  return generateRandomName();
}

function generateDateWritten(): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const currentDate = new Date();
  const dateWritten = formatter.format(currentDate);

  return dateWritten;
}

export default async function generateRandomArticle(): Promise<{
  Title: string;
  Body: string;
  Author: string;
  DateWritten: string;
}> {
  const article = {
    Title: generateArticleTitle(),
    Body: await generateArticleBody(
      "Palms Leaves Inc.",
      "PALM",
      "Alivn Bronson",
      "Financial",
      3,
    ),
    Author: generateAuthor(),
    DateWritten: generateDateWritten(),
  };
  return article;
}

// TESTING:
/*const article = await generateRandomArticle();
console.log(article.Title);
console.log(article.Body);
console.log(article.Author);
console.log(article.DateWritten);*/
