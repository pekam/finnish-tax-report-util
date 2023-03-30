import { DateTime } from "luxon";
import { readIbTransactionsFromCSV } from "./ib/readIbTransactionsFromCSV";
import { processTransactions } from "./process-transactions/processTransactions";

/**
 * Input transaction, provided from the broker.
 */
export interface Transaction {
  symbol: string;
  time: DateTime;
  /**
   * Negative if selling
   */
  quantity: number;
  price: number;
  feeUsd: number;
}

export interface HandledTransaction extends Transaction {
  balanceChangeEur: number;
  closedPnlExcludingFees: number;
  eurUsd: number;
  feeEur: number;
}

export interface UnclosedEntry extends HandledTransaction {
  remaining: number;
}

const transactions = readIbTransactionsFromCSV();

console.log(transactions.slice(0, 2));

console.log(processTransactions(transactions));

// console.log(getSummary(transactions).unclosedEntries);
