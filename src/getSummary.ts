import { drop, pickBy, sumBy } from "remeda";
import { Transaction } from ".";

/**
 * Summary values needed by Vero, and unclosed positions with their entry
 * prices, which will be needed for the following year's taxes.
 */
export interface Summary {
  winningTrades: {
    totalSales: number;
    totalBuys: number;
  };
  losingTrades: {
    totalSales: number;
    totalBuys: number;
  };
  unclosedEntries: { [key: string]: Entry[] };
}

/**
 * Unclosed transaction.
 */
interface Entry extends Transaction {
  remaining: number;
}

/*
Vero-ilmoitukseen tarvitaan:
Voitolliset kaupat:
- Myyntihinnat yhteensä
- Hankintahinnat yhteensä
Tappiolliset kaupat:
- Myyntihinnat yhteensä
- Hankintahinnat yhteensä
*/

/**
 *
 * @param transactions sorted by time (ascending)
 */
export function getSummary(transactions: Transaction[]): Summary {
  return transactions.reduce<Summary>(addToTotals, {
    winningTrades: {
      totalSales: 0,
      totalBuys: 0,
    },
    losingTrades: {
      totalSales: 0,
      totalBuys: 0,
    },
    unclosedEntries: {},
  });
}

function addToTotals(summary: Summary, transaction: Transaction): Summary {
  const balance = getBalance(summary, transaction.symbol);

  const nextBalance = balance + transaction.quantity; // quantity is negative if selling

  if ((balance > 0 && nextBalance < 0) || (balance > 0 && nextBalance < 0)) {
    console.log({ balance, nextBalance, transaction });
    throw Error(
      "Closing and entering position with single transaction is not supported at the moment."
    );
  }

  if (balance === 0 || Math.abs(nextBalance) > Math.abs(balance)) {
    return addEntry(summary, transaction);
  } else {
    return closeEntries(summary, transaction, transaction.quantity);
  }
}

function getBalance(summary: Summary, symbol: string): number {
  return sumBy(summary.unclosedEntries[symbol] || [], (e) => e.quantity);
}

function addEntry(summary: Summary, transaction: Transaction): Summary {
  const { symbol, quantity } = transaction;
  const entry: Entry = { ...transaction, remaining: quantity };
  return {
    ...summary,
    unclosedEntries: {
      ...summary.unclosedEntries,
      [symbol]: [...(summary.unclosedEntries[symbol] || []), entry],
    },
  };
}

function closeEntries(
  summary: Summary,
  transaction: Transaction,
  remainingToReduce: number
): Summary {
  const { symbol } = transaction;

  if (remainingToReduce === 0) {
    return summary;
  }

  const unclosedEntries = summary.unclosedEntries[symbol];

  const entry = unclosedEntries[0];

  if (Math.abs(remainingToReduce) >= Math.abs(entry.remaining)) {
    return closeEntries(
      updateUnclosedEntries(summary, symbol, drop(unclosedEntries, 1)),
      transaction,
      remainingToReduce + entry.remaining
    );
  } else {
    return closeEntries(
      updateUnclosedEntries(
        summary,
        symbol,
        changeFirst(unclosedEntries, {
          ...entry,
          remaining: entry.remaining + remainingToReduce,
        })
      ),
      transaction,
      0
    );
  }
}

function updateUnclosedEntries(
  summary: Summary,
  symbol: string,
  newValue: Entry[]
): Summary {
  if (!newValue.length) {
    return {
      ...summary,
      unclosedEntries: pickBy(
        summary.unclosedEntries,
        (value, key) => key !== symbol
      ),
    };
  }
  return {
    ...summary,
    unclosedEntries: { ...summary.unclosedEntries, [symbol]: newValue },
  };
}

function changeFirst<T>(array: T[], newValue: T): T[] {
  return [newValue, ...drop(array, 1)];
}
