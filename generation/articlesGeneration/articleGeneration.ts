import { generateRandomName } from "../articlesGeneration/executiveNameGeneration.ts";

export function generateArticleTitle(): string {
  return "Glorious Title";
}

// TODO: GPT3.5 tubro model to create a story off the set parameters.
function generateArticleBody(
  _companyName: string,
  _CEOName: string,
  _industryType: string,
  _effect: string,
): string {
  // Call LMM
  return "Even more glorious text";
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

export function generateRandomArticle(): {
  Title: string;
  Body: string;
  Author: string;
  DateWritten: string;
} {
  const article = {
    Title: generateArticleTitle(),
    Body: generateArticleBody("", "", "", ""),
    Author: generateAuthor(),
    DateWritten: generateDateWritten(),
  };
  return article;
}
// TESTING:
// const article = generateRandomArticle();
// console.log(article.Title);
// console.log(article.Body);
// console.log(article.Author);
// console.log(article.DateWritten);
