import { stringify } from "csv/sync";
import { filter, pipe, sumBy } from "remeda";
import { HandledTransaction } from "..";

export function generateSummaryCSV(transactions: HandledTransaction[]) {
  const totalSales = pipe(
    transactions,
    filter((t) => t.quantity < 0),
    sumBy((t) => t.balanceChangeEurExcludingFees)
  );

  const totalWins = pipe(
    transactions,
    filter((t) => t.closedPnlExcludingFees > 0),
    sumBy((t) => t.closedPnlExcludingFees)
  );

  const totalLosses = pipe(
    transactions,
    filter((t) => t.closedPnlExcludingFees < 0),
    sumBy((t) => t.closedPnlExcludingFees),
    (negativeLosses) => Math.abs(negativeLosses)
  );

  const totalFees = pipe(
    transactions,
    sumBy((t) => t.feeEur)
  );

  const summaryCSV = stringify([
    ["total sales (EUR)", totalSales],
    ["total wins (EUR)", totalWins],
    ["total losses (EUR)", totalLosses],
    ["total fees (EUR)", totalFees],
  ]);

  return summaryCSV;
}
