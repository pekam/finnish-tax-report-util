import { Transaction } from ".";
import { getEurUsd } from "./getEurUsd";
import { ibTradeRowToObject } from "./ibTradeRowToObject";

const finnishTimezone = "Europe/Helsinki";

export function convertTransaction(
  rawTransaction: ReturnType<typeof ibTradeRowToObject>
): Transaction {
  const {
    symbol,
    dateTime,
    quantity,
    fee: feeUsd,
    price: priceUsd,
    proceeds: balanceChangeUsd,
    realizedPnl: realizedPnlUsd,
  } = rawTransaction;

  const eurUsd = getEurUsd(dateTime);
  const toEuros = (usd: number) => usd / eurUsd;

  return {
    time: dateTime.setZone(finnishTimezone).toISO(),
    symbol,
    quantity,

    priceUsd,
    priceEur: toEuros(priceUsd),

    feeUsd,
    feeEur: toEuros(priceUsd),

    balanceChangeUsd,
    balanceChangeEur: toEuros(balanceChangeUsd),

    realizedPnlUsd,
    realizedPnlEur: toEuros(realizedPnlUsd),

    eurUsd,
  };
}
