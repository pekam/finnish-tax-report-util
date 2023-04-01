import * as csv from "csv/sync";
import { HandledTransaction } from "..";

export function generateTransactionsCSV(transactions: HandledTransaction[]) {
  const transactionsCSV = csv.stringify(
    transactions.map(transformTransaction),
    {
      header: true,
    }
  );
  return transactionsCSV;
}

function transformTransaction({
  symbol,
  time,
  quantity,
  price,
  eurUsd,
  balanceChangeEurExcludingFees,
  closedPnlExcludingFees,
  feeUsd,
  feeEur,
}: HandledTransaction) {
  return {
    symbol,
    quantity,
    "price (USD)": price,
    "balance change (EUR, excluding fees)": balanceChangeEurExcludingFees,
    "closed profit or loss (EUR, excluding fees)": closedPnlExcludingFees,
    "fee (USD)": feeUsd,
    "fee (EUR)": feeEur,
    time: time.toISO(),
    "EUR/USD": eurUsd,
  };
}
