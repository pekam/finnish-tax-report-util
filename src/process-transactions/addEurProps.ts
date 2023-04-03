import { Transaction, TransactionWithEuros } from "..";
import { EurUsdMap, getEurUsd } from "../getEurUsd";

export const addEurProps =
  (eurUsdMap: EurUsdMap) =>
  (transaction: Transaction): TransactionWithEuros => {
    const { time, quantity, priceUsd, feeUsd } = transaction;
    const eurUsd = getEurUsd(time, eurUsdMap);
    const toEur = (usd: number) => usd / eurUsd;

    const balanceChangeEurExcludingFees = toEur(-quantity * priceUsd);
    const feeEur = toEur(feeUsd);

    return {
      ...transaction,
      eurUsd,
      balanceChangeEurExcludingFees,
      feeEur,
    };
  };
