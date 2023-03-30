import { DateTime } from "luxon";
import { sumBy } from "remeda";
import { getEurUsd } from "../getEurUsd";
import { addEntry } from "./addEntry";
import { closeEntries } from "./closeEntries";

/**
 * Input transaction, provided from the broker.
 */
export interface Trans {
  symbol: string;
  time: DateTime;
  /**
   * Negative if selling
   */
  quantity: number;
  price: number;
  feeUsd: number;
}

export interface HandledTrans extends Trans {
  balanceChangeEur: number;
  closedPnlExcludingFees: number;
  eurUsd: number;
  feeEur: number;
}

interface UnclosedEntry extends HandledTrans {
  remaining: number;
}

export interface State {
  unclosed: { [key: string]: UnclosedEntry[] };
  handled: HandledTrans[];
}

export function processTransactions(transactions: Trans[]) {
  const initialState: State = {
    unclosed: {},
    handled: [],
  };

  transactions.reduce(handleTransaction, initialState);
}

function handleTransaction(state: State, transaction: Trans) {
  const balance = getBalance(state, transaction.symbol);

  if (balance === 0 || transaction.quantity > 0 === balance > 0) {
    return addEntry(state, transaction);
  } else {
    return closeEntries(state, transaction);
  }
}

export function getEurProps({ time, quantity, price, feeUsd: fee }: Trans) {
  const eurUsd = getEurUsd(time);
  const balanceChangeEur = (quantity * price) / eurUsd;
  const feeEur = fee / eurUsd;
  return { eurUsd, balanceChangeEur, feeEur };
}

function getBalance(state: State, symbol: string): number {
  return sumBy(state.unclosed[symbol] || [], (t) => t.quantity);
}
