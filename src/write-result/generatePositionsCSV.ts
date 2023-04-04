import * as csv from "csv/sync";
import { flatten, map, pipe, toPairs, values } from "remeda";
import { HandledTransaction } from "..";
import { State } from "../process-transactions/processTransactions";
import { getPositionsMap } from "../util";

export function generatePositionsCSV(unclosed: State["unclosed"]) {
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
  closedPnlExcludingFees,
  feeUsd,
  feeEur,
  quantity,
}: HandledTransaction) {
  return {
    symbol,
    "remaining quantity": quantity,
    "price (USD)": priceUsd,
    "balance change (EUR, excluding fees)": balanceChangeEurExcludingFees,
    "closed profit or loss (EUR, excluding fees)": closedPnlExcludingFees,
    "fee (USD)": feeUsd,
    "fee (EUR)": feeEur,
    time: time.toISO(),
    "EUR/USD": eurUsd,
  };
}
