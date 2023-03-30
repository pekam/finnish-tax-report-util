import { DateTime } from "luxon";
import { getEurUsd, getEurUsdMap } from "./getEurUsd";
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

export interface TransactionWithCurrencyRate extends Transaction {
  eurUsd: number;
}

export interface HandledTransaction extends TransactionWithCurrencyRate {
  balanceChangeEur: number;
  closedPnlExcludingFees: number;
  feeEur: number;
}

export interface UnclosedEntry extends HandledTransaction {
  remaining: number;
}

const eurUsdMap = getEurUsdMap();

const transactions = readIbTransactionsFromCSV();
const transactionsWithCurrencyRates: TransactionWithCurrencyRate[] =
  transactions.map((t) => ({
    ...t,
    eurUsd: getEurUsd(t.time, eurUsdMap),
  }));

const result = processTransactions(transactionsWithCurrencyRates);

console.log(transactions.slice(0, 2));

console.log(result);

// console.log(getSummary(transactions).unclosedEntries);
