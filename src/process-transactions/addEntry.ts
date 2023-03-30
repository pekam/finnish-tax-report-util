import { HandledTransaction, Transaction } from "..";
import { getEurProps, State } from "./processTransactions";

export function addEntry(state: State, transaction: Transaction): State {
  const { symbol } = transaction;
  const handled: HandledTransaction = {
    ...transaction,
    ...getEurProps(transaction),
    closedPnlExcludingFees: 0,
  };
  return {
    ...state,
    unclosed: {
      ...state.unclosed,
      [symbol]: [
        ...(state.unclosed[symbol] || []),
        { ...handled, remaining: handled.quantity },
      ],
    },
    handled: [...state.handled, handled],
  };
}
