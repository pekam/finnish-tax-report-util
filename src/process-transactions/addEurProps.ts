import { Transaction, TransactionWithEuros } from "..";
import { EurUsdMap, getEurUsd } from "../getEurUsd";
import { getBalanceChangeEurExcludingFees, toEuros } from "../util";

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
