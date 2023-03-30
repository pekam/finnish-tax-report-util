import { getSummary } from "./getSummary";
import { readIbTransactionsFromCSV } from "./ib/readIbTransactionsFromCSV";

/**
 * Single row in the output CSV that will be provided to Vero.
 */
export interface Transaction {
  time: string;
  symbol: string;
  /**
   * Signed (negative if selling).
   */
  quantity: number;

  priceUsd: number;
  priceEur: number;

  feeUsd: number;
  feeEur: number;

  /**
   * Excluding fees.
   */
  balanceChangeUsd: number;
  /**
   * Excluding fees.
   */
  balanceChangeEur: number;

  realizedPnlUsd: number;
  realizedPnlEur: number;

  eurUsd: number;
}

const transactions = readIbTransactionsFromCSV();

console.log(transactions.slice(0, 2));

console.log(getSummary(transactions).unclosedEntries);
