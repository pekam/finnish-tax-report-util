import { Transaction, TransactionWithEuros } from ".";
import { EurUsdMap, getEurUsd } from "./getEurUsd";

export const addEurProps =
  (eurUsdMap: EurUsdMap) =>
  (transaction: Transaction): TransactionWithEuros => {
    const { time, quantity, price, feeUsd: fee } = transaction;
    const eurUsd = getEurUsd(time, eurUsdMap);
    const toEur = (usd: number) => usd / eurUsd;

    const balanceChangeEur = toEur(quantity * price);
    const feeEur = toEur(fee);

    return { ...transaction, eurUsd, balanceChangeEur, feeEur };
  };
