const MIN_PRICE = 0.01;
const MAX_PRICE = 1000.00;

export function makeCent(num: number) {
  return Math.round(num * 100) / 100;
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
