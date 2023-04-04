import { Transaction, TransactionWithEuros } from "..";
import { EurUsdMap, getEurUsd } from "../getEurUsd";

export const addEurProps =
  (eurUsdMap: EurUsdMap) =>
  (transaction: Transaction): TransactionWithEuros => {
    const eurUsd = getEurUsd(transaction.time, eurUsdMap);

    const balanceChangeEurExcludingFees = getBalanceChangeEurExcludingFees({
      ...transaction,
      eurUsd,
    });
    const feeEur = toEuros({ usd: transaction.feeUsd, eurUsd });

    return {
      ...transaction,
      eurUsd,
      balanceChangeEurExcludingFees,
      feeEur,
    };
  };

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
