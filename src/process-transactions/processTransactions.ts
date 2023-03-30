import { map, pipe, reduce, sumBy } from "remeda";
import {
  HandledTransaction,
  Transaction,
  TransactionWithEuros,
  UnclosedEntry,
} from "..";
import { EurUsdMap } from "../getEurUsd";
import { addEntry } from "./addEntry";
import { addEurProps } from "./addEurProps";
import { closeEntries } from "./closeEntries";

export interface State {
  unclosed: { [key: string]: UnclosedEntry[] };
  handled: HandledTransaction[];
}

export function processTransactions(
  transactions: Transaction[],
  eurUsdMap: EurUsdMap
) {
  const initialState: State = {
    unclosed: {},
    handled: [],
  };

  return pipe(
    transactions,
    map(addEurProps(eurUsdMap)),
    reduce(handleTransaction, initialState)
  );
}

function handleTransaction(state: State, transaction: TransactionWithEuros) {
  const balance = getBalance(state, transaction.symbol);

  if (balance === 0 || transaction.quantity > 0 === balance > 0) {
    return addEntry(state, transaction);
  } else {
    return closeEntries(state, transaction);
  }
}

function getBalance(state: State, symbol: string): number {
  return sumBy(state.unclosed[symbol] || [], (t) => t.quantity);
}
