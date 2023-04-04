export function toEuros({ usd, eurUsd }: { usd: number; eurUsd: number }) {
  return usd / eurUsd;
}

export function getBalanceChangeEurExcludingFees({
  priceUsd,
  eurUsd,
  quantity,
}: {
  priceUsd: number;
  eurUsd: number;
  quantity: number;
}) {
  const balanceChangeUsd = -quantity * priceUsd;
  return toEuros({ usd: balanceChangeUsd, eurUsd });
}
