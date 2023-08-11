import { z } from "zod";
import { CompanyDBSchema } from "../routes/models/company.ts";

const MIN_PRICE = 0.01;
const MAX_PRICE = 1000.0;

export function makeCent(num: number) {
  return Math.round(num * 100) / 100;
}

export function makeWhole(num: number) {
  return Math.round(num);
}

export function makeThousand(num: number) {
  return Math.round(num / 1000) * 1000;
}

export function getRandomPrice() {
  const price = Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE;
  return makeCent(price);
}

const MAXIMUM_NET_INCOME = 1000000000;
export function generateNetIncome() {
  return makeCent(makeThousand(Math.random() * MAXIMUM_NET_INCOME));
}

const MIN_GROSS_MARGIN = 0.1;
const MAX_GROSS_MARGIN = 0.9;

export function generateGrossMargin() {
  return makeCent(
    Math.random() * (MAX_GROSS_MARGIN - MIN_GROSS_MARGIN) + MIN_GROSS_MARGIN
  );
}

const MIN_DE_RATIO = 0;
const MAX_DE_RATIO = 5;

export function generateDebtEquityRatio() {
  return makeCent(Math.random() * (MAX_DE_RATIO - MIN_DE_RATIO) + MIN_DE_RATIO);
}

const MIN_PE_RATIO = 1;
const MAX_PE_RATIO = 100;

export function generatePERatio() {
  return makeWhole(
    Math.random() * (MAX_PE_RATIO - MIN_PE_RATIO) + MIN_PE_RATIO
  );
}

const MIN_ROE = 0.1;
const MAX_ROE = 2;

export function generateROE() {
  return makeCent(Math.random() * (MAX_ROE - MIN_ROE) + MIN_ROE);
}

// TODO: fix this
export function getNextPrice(
  prevPrice: number,
  company: z.infer<typeof CompanyDBSchema>,
  volatility: number
): number {
  // Normalize the financial metrics
  const normalizedNetIncome = Math.min(
    1,
    Math.max(0, company.netIncome / MAXIMUM_NET_INCOME)
  );
  const normalizedGrossMargin =
    (company.grossMargin - MIN_GROSS_MARGIN) /
    (MAX_GROSS_MARGIN - MIN_GROSS_MARGIN);
  const normalizedDeRatio = company.deRatio / MAX_DE_RATIO;
  const normalizedPERatio =
    (company.peRatio - MIN_PE_RATIO) / (MAX_PE_RATIO - MIN_PE_RATIO);
  const normalizedROE = (company.roe - MIN_ROE) / (MAX_ROE - MIN_ROE);

  // Average the normalized metrics
  const averageMetric =
    (normalizedNetIncome +
      normalizedGrossMargin +
      normalizedDeRatio +
      normalizedPERatio +
      normalizedROE) /
    5;

  // Normalize the rating
  const normalizedRating = (company.rating + 5) / 10;

  // Compute totalEffect
  const totalEffect = averageMetric + normalizedRating;

  // Get a random decision factor between 0 and 2
  const decisionFactor = Math.random() * 2;

  let nextPrice;
  const priceChange = Math.random() * 10 * volatility;
  if (decisionFactor > totalEffect) {
    // Increase the price
    nextPrice = prevPrice + priceChange;
  } else {
    // Decrease the price
    nextPrice = prevPrice - priceChange;
  }

  // Bounce back if price falls below 10
  if (nextPrice < 10) {
    nextPrice = 10 + Math.random() * 10;
  }

  // Bounce down if price exceeds 1990
  if (nextPrice > 1990) {
    nextPrice = 1990 - Math.random() * 10;
  }

  return makeCent(nextPrice);
}
