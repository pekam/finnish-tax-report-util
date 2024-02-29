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
  priceUsd,
  eurUsd,
  balanceChangeEurExcludingFees,
  closedPnlExcludingFees,
  feeUsd,
  feeEur,
}: HandledTransaction) {
  return {
    symbol,
    quantity,
    "price (USD)": priceUsd,
    "balance change (EUR, excluding fees)":
      balanceChangeEurExcludingFees.toFixed(5),
    "closed profit or loss (EUR, excluding fees)":
      closedPnlExcludingFees.toFixed(5),
    "fee (USD)": feeUsd.toFixed(5),
    "fee (EUR)": feeEur.toFixed(5),
    time: time.toISO(),
    "EUR/USD": eurUsd,
  };
}
