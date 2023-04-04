import * as csv from "csv/sync";
import { flatten, map, mapValues, pipe, sumBy, toPairs, values } from "remeda";
import { HandledTransaction } from "..";
import { State } from "../process-transactions/processTransactions";

export function generatePositionsCSV(unclosed: State["unclosed"]) {
  const totalPositionsCSV = pipe(
    unclosed,
    getTotalPositions,
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

function getTotalPositions(unclosed: State["unclosed"]) {
  return mapValues(unclosed, (entries) => sumBy(entries, (e) => e.quantity));
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
