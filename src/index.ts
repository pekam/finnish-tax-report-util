import { DateTime } from "luxon";
import { getEurUsdMap } from "./getEurUsd";
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

export interface TransactionWithEuros extends Transaction {
  eurUsd: number;
  balanceChangeEurExcludingFees: number;
  feeEur: number;
}

export interface HandledTransaction extends TransactionWithEuros {
  closedPnlExcludingFees: number;
}

export interface UnclosedEntry extends HandledTransaction {
  remaining: number;
}

const eurUsdMap = getEurUsdMap();

const transactions = readIbTransactionsFromCSV();

const result = processTransactions(transactions, eurUsdMap);

console.log(transactions.slice(0, 2));

console.log(result);

// console.log(getSummary(transactions).unclosedEntries);
