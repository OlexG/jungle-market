const MIN_PRICE = 0.01;
const MAX_PRICE = 1000.00;

export function getRandomPrice() {
  return Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE;
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
  return price + changeAmount;
}
