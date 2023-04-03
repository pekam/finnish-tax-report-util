import { DateTime } from "luxon";
import { Transaction } from "../src";
import { EurUsdMap } from "../src/getEurUsd";
import { processTransactions } from "../src/process-transactions/processTransactions";

const defaultDate = "2022-01-01";

const defaultEurUsdMap: EurUsdMap = { [defaultDate]: 1 };

export interface MockTransactionArgs {
  quantity: number;
  priceUsd: number;
  dateISO?: string;
}

function createTransaction({
  priceUsd,
  quantity,
  dateISO,
}: MockTransactionArgs): Transaction {
  return {
    symbol: "foo",
    priceUsd,
    quantity,
    time: DateTime.fromISO(dateISO || defaultDate),
    feeUsd: 1,
  };
}

export function process(
  transactionArgs: MockTransactionArgs[],
  eurUsdMap?: EurUsdMap
) {
  return processTransactions(
    transactionArgs.map(createTransaction),
    eurUsdMap || defaultEurUsdMap
  );
}
