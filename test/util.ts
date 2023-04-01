import { DateTime } from "luxon";
import { Transaction } from "../src";
import { EurUsdMap } from "../src/getEurUsd";
import { processTransactions } from "../src/process-transactions/processTransactions";

const date = "2022-01-01";
const eurUsdMap: EurUsdMap = { [date]: 1 };

export interface MockTransactionArgs {
  quantity: number;
  price: number;
}

function createTransaction({
  price,
  quantity,
}: MockTransactionArgs): Transaction {
  return {
    symbol: "foo",
    price,
    quantity,
    time: DateTime.fromISO(date),
    feeUsd: 1,
  };
}

export function process(transactionArgs: MockTransactionArgs[]) {
  return processTransactions(transactionArgs.map(createTransaction), eurUsdMap);
}
