import { sumBy } from "remeda";
import {
  HandledTransaction,
  TransactionWithCurrencyRate,
  UnclosedEntry,
} from "..";
import { addEntry } from "./addEntry";
import { closeEntries } from "./closeEntries";

export interface State {
  unclosed: { [key: string]: UnclosedEntry[] };
  handled: HandledTransaction[];
}

export function processTransactions(
  transactions: TransactionWithCurrencyRate[]
) {
  const initialState: State = {
    unclosed: {},
    handled: [],
  };

  return transactions.reduce(handleTransaction, initialState);
}

function handleTransaction(
  state: State,
  transaction: TransactionWithCurrencyRate
) {
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
