import { HandledTransaction, TransactionWithCurrencyRate } from "..";
import { getEurProps } from "./getEurProps";
import { State } from "./processTransactions";

export function addEntry(
  state: State,
  transaction: TransactionWithCurrencyRate
): State {
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
