import { HandledTransaction, TransactionWithEuros } from "..";
import { State } from "./processTransactions";

export function addEntry(
  state: State,
  transaction: TransactionWithEuros
): State {
  const { symbol } = transaction;
  const handled: HandledTransaction = {
    ...transaction,
    closedPnlExcludingFees: 0,
  };
  return {
    ...state,
    unclosed: {
      ...state.unclosed,
      [symbol]: [
        ...(state.unclosed[symbol] || []),
        {
          ...handled,
        },
      ],
    },
    handled: [...state.handled, handled],
  };
}
