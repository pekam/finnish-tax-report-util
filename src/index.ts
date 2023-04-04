import { DateTime } from "luxon";
import { getEurUsdMap } from "./getEurUsd";
import { readIbTransactionsFromCSV } from "./ib/readIbTransactionsFromCSV";
import { processTransactions } from "./process-transactions/processTransactions";
import { writeResult } from "./write-result/writeResult";

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
  priceUsd: number;
  feeUsd: number;
}

export interface TransactionWithEuros extends Transaction {
  eurUsd: number;
  /**
   * How many euros were lost (if buying) or gained (if selling) with this
   * transaction.
   */
  balanceChangeEurExcludingFees: number;
  feeEur: number;
}

export interface HandledTransaction extends TransactionWithEuros {
  closedPnlExcludingFees: number;
}

const eurUsdMap = getEurUsdMap();

const inputTransactions = readIbTransactionsFromCSV();

const finalState = processTransactions(inputTransactions, eurUsdMap);

writeResult(finalState);
