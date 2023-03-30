import { sumBy } from "remeda";
import { HandledTransaction, Transaction, UnclosedEntry } from "..";
import { getEurUsd } from "../getEurUsd";
import { addEntry } from "./addEntry";
import { closeEntries } from "./closeEntries";

export interface State {
  unclosed: { [key: string]: UnclosedEntry[] };
  handled: HandledTransaction[];
}

export function processTransactions(transactions: Transaction[]) {
  const initialState: State = {
    unclosed: {},
    handled: [],
  };

  return transactions.reduce(handleTransaction, initialState);
}

function handleTransaction(state: State, transaction: Transaction) {
  const balance = getBalance(state, transaction.symbol);

  if (balance === 0 || transaction.quantity > 0 === balance > 0) {
    return addEntry(state, transaction);
  } else {
    return closeEntries(state, transaction);
  }
}

export function getEurProps({
  time,
  quantity,
  price,
  feeUsd: fee,
}: Transaction) {
  const eurUsd = getEurUsd(time);
  const balanceChangeEur = (quantity * price) / eurUsd;
  const feeEur = fee / eurUsd;
  return { eurUsd, balanceChangeEur, feeEur };
}

function getBalance(state: State, symbol: string): number {
  return sumBy(state.unclosed[symbol] || [], (t) => t.quantity);
}
