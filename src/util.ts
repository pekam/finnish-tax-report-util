import { mapValues, sumBy } from "remeda";
import { Transaction } from ".";
import {
  State,
  UnclosedEntriesMap,
} from "./process-transactions/processTransactions";

const sumQuantities = sumBy<Transaction>((t) => t.quantity);

export function getPosition(state: State, symbol: string): number {
  return sumQuantities(state.unclosed[symbol] || []);
}

export function getPositionsMap(unclosed: UnclosedEntriesMap) {
  return mapValues(unclosed, sumQuantities);
}

export function toEuros({ usd, eurUsd }: { usd: number; eurUsd: number }) {
  return usd / eurUsd;
}

export function getBalanceChangeEurExcludingFees({
  priceUsd,
  eurUsd,
  quantity,
}: {
  priceUsd: number;
  eurUsd: number;
  quantity: number;
}) {
  const balanceChangeUsd = -quantity * priceUsd;
  return toEuros({ usd: balanceChangeUsd, eurUsd });
}
