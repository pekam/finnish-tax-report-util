import * as csv from "csv/sync";
import { flatten, map, pipe, toPairs, values } from "remeda";
import { TransactionWithEuros } from "..";
import { UnclosedEntriesMap } from "../process-transactions/processTransactions";
import { getPositionsMap } from "../util";

export function generatePositionsCSV(unclosed: UnclosedEntriesMap) {
  const totalPositionsCSV = pipe(
    unclosed,
    getPositionsMap,
    toPairs,
    csv.stringify,
    (csvString) => "symbol,position\n" + csvString
  );

  const unclosedTransactionsCSV = pipe(
    unclosed,
    values,
    flatten(),
    map(transformUnclosedEntry),
    (rows) => csv.stringify(rows, { header: true })
  );

  return totalPositionsCSV + "\n" + unclosedTransactionsCSV;
}

function transformUnclosedEntry({
  symbol,
  time,
  priceUsd,
  eurUsd,
  balanceChangeEurExcludingFees,
  feeUsd,
  feeEur,
  quantity,
}: TransactionWithEuros) {
  return {
    symbol,
    "remaining quantity": quantity,
    "price (USD)": priceUsd,
    "balance change (EUR, excluding fees)": balanceChangeEurExcludingFees,
    "fee (USD)": feeUsd,
    "fee (EUR)": feeEur,
    time: time.toISO(),
    "EUR/USD": eurUsd,
  };
}
