import { identity, sumBy } from "remeda";
import { HandledTransaction, TransactionWithEuros } from "..";
import { getBalanceChangeEurExcludingFees } from "./addEurProps";
import { State } from "./processTransactions";

export function closeEntries(state: State, transaction: TransactionWithEuros) {
  let remaining = transaction.quantity;

  // Balance changes of the entry transactions (or their parts) closed by the
  // incoming transaction.
  let entryBalanceChangesEur: number[] = [];

  while (remaining !== 0) {
    const unclosed = state.unclosed[transaction.symbol];
    if (!unclosed.length) {
      throw Error(
        "Closing and entering position with single transaction is not supported at the moment. " +
          "Please manually edit the data by splitting the transaction into two. " +
          JSON.stringify(transaction)
      );
    }
    const oldestUnclosed = unclosed[0];

    const oldestUnclosedAbsoluteRemaining = Math.abs(
      oldestUnclosed.remainingQuantity
    );

    // Remove oldest entry, reduce remaining
    if (oldestUnclosedAbsoluteRemaining <= Math.abs(remaining)) {
      const closedQuantityProportion =
        oldestUnclosedAbsoluteRemaining /
        Math.abs(oldestUnclosed.originalQuantity);
      entryBalanceChangesEur.push(oldestUnclosed.balanceChangeEurExcludingFees);

      unclosed.shift();
      if (!unclosed.length) {
        delete state.unclosed[transaction.symbol];
      }
      remaining += oldestUnclosed.remainingQuantity;
    }

    // Reduce oldest entry, finish
    else {
      const closedBalanceChange = getBalanceChangeEurExcludingFees({
        eurUsd: oldestUnclosed.eurUsd,
        priceUsd: oldestUnclosed.priceUsd,
        quantity: -remaining,
      });
      entryBalanceChangesEur.push(closedBalanceChange);

      oldestUnclosed.remainingQuantity += remaining;
      oldestUnclosed.balanceChangeEurExcludingFees -= closedBalanceChange;
      remaining = 0;
    }
  }

  const closedEntriesBalanceChange = sumBy(entryBalanceChangesEur, identity);

  const closedPnlExcludingFees =
    closedEntriesBalanceChange + transaction.balanceChangeEurExcludingFees;

  const handledTransaction: HandledTransaction = {
    ...transaction,
    closedPnlExcludingFees,
  };

  state.handled.push(handledTransaction);

  return state;
}
