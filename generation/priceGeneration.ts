const MIN_PRICE = 0.01;
const MAX_PRICE = 1000.00;

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

// TODO: fix this
export function getNextPrice(price: number) {
  const volatility = 0.01;
  const rnd = Math.random();
  let changePercent = 2 * volatility * rnd;
  if (changePercent > volatility
    && changePercent < 2 * volatility) {
    changePercent -= (2 * volatility);
  }
  const changeAmount = price * changePercent;
  const newPrice = price + changeAmount;
  return makeCent(newPrice);
}

const MAXIMUM_NET_INCOME = 1000000000;
export function generateNetIncome() {
  return makeCent(makeThousand(Math.random() * MAXIMUM_NET_INCOME));
}

const MIN_GROSS_MARGIN = 0.1;
const MAX_GROSS_MARGIN = 0.9;

export function generateGrossMargin() {
  return makeCent(Math.random() * (MAX_GROSS_MARGIN - MIN_GROSS_MARGIN) + MIN_GROSS_MARGIN);
}

const MIN_DE_RATIO = 0;
const MAX_DE_RATIO = 5;

export function generateDebtEquityRatio() {
  return makeCent(Math.random() * (MAX_DE_RATIO - MIN_DE_RATIO) + MIN_DE_RATIO);
}

const MIN_PE_RATIO = 1;
const MAX_PE_RATIO = 100;

export function generatePERatio() {
  return makeWhole(Math.random() * (MAX_PE_RATIO - MIN_PE_RATIO) + MIN_PE_RATIO);
}

const MIN_ROE = 0.1;
const MAX_ROE = 2;

export function generateROE() {
  return makeCent(Math.random() * (MAX_ROE - MIN_ROE) + MIN_ROE);
}

