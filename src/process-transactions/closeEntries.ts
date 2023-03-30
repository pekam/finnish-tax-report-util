import { identity, sumBy } from "remeda";
import { HandledTransaction, TransactionWithEuros } from "..";
import { State } from "./processTransactions";

export function closeEntries(state: State, transaction: TransactionWithEuros) {
  let remaining = transaction.quantity;
  let entryBalanceChangesEur: number[] = [];

  while (Math.abs(remaining) > 0) {
    const unclosed = state.unclosed[transaction.symbol];
    if (!unclosed.length) {
      throw Error(
        "Closing and entering position with single transaction is not supported at the moment. " +
          "Please manually edit the data by splitting the transaction into two. " +
          JSON.stringify(transaction)
      );
    }
    const oldestUnclosed = unclosed[0];

    const oldestUnclosedAbsoluteRemaining = Math.abs(oldestUnclosed.remaining);

    // Remove oldest entry, reduce remaining
    if (oldestUnclosedAbsoluteRemaining < remaining) {
      entryBalanceChangesEur.push(
        (oldestUnclosedAbsoluteRemaining / Math.abs(oldestUnclosed.quantity)) *
          oldestUnclosed.balanceChangeEur
      );
      unclosed.shift();
      remaining += oldestUnclosed.remaining;
    }

    // Reduce oldest entry, finish
    else {
      entryBalanceChangesEur.push(
        (remaining / Math.abs(oldestUnclosed.quantity)) *
          oldestUnclosed.balanceChangeEur
      );
      oldestUnclosed.remaining += remaining;
      remaining = 0;
    }
  }

  const closedEntriesValue = sumBy(entryBalanceChangesEur, identity);

  const closedPnlExcludingFees =
    closedEntriesValue + transaction.balanceChangeEur;

  const handledTransaction: HandledTransaction = {
    ...transaction,
    closedPnlExcludingFees,
  };

  state.handled.push(handledTransaction);

  return state;
}
