import { getEurProps, HandledTrans, State, Trans } from "./processTransactions";

export function addEntry(state: State, transaction: Trans): State {
  const { symbol } = transaction;
  const handled: HandledTrans = {
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
