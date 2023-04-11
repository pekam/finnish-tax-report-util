import { map, pipe, reduce } from "remeda";
import { HandledTransaction, Transaction, TransactionWithEuros } from "..";
import { EurUsdMap } from "../getEurUsd";
import { getPosition } from "../util";
import { addEntry } from "./addEntry";
import { addEurProps } from "./addEurProps";
import { closeEntries } from "./closeEntries";

export interface State {
  /**
   * Transactions with profit/loss calculated as euros, ready to be reported.
   */
  handled: HandledTransaction[];
  /**
   * Entry transactions which are not yet closed (based on the FIFO principle).
   * If the entry is partially closed, quantity and balanceChange will be
   * reduced accordingly, and the transaction object will not match the
   * HandledTransaction in State.handled.
   */
  unclosed: UnclosedEntriesMap;
}

export type UnclosedEntriesMap = { [key: string]: TransactionWithEuros[] };

export function processTransactions(
  transactions: Transaction[],
  eurUsdMap: EurUsdMap,
  unclosedEntriesFromPreviousYears: UnclosedEntriesMap
) {
  const initialState: State = {
    unclosed: unclosedEntriesFromPreviousYears,
    handled: [],
  };

  return pipe(
    transactions,
    map(addEurProps(eurUsdMap)),
    reduce(handleTransaction, initialState)
  );
}

function handleTransaction(state: State, transaction: TransactionWithEuros) {
  const position = getPosition(state, transaction.symbol);

  if (position === 0 || transaction.quantity > 0 === position > 0) {
    return addEntry(state, transaction);
  } else {
    return closeEntries(state, transaction);
  }
}
