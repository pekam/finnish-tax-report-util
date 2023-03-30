import { TransactionWithCurrencyRate } from "..";

export function getEurProps({
  quantity,
  price,
  eurUsd,
  feeUsd: fee,
}: TransactionWithCurrencyRate) {
  const toEur = (usd: number) => usd / eurUsd;

  const balanceChangeEur = toEur(quantity * price);
  const feeEur = toEur(fee);
  return { eurUsd, balanceChangeEur, feeEur };
}
