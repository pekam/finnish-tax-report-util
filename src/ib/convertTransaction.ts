import { Transaction } from "..";
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
  } = rawTransaction;

  return {
    symbol,
    time: dateTime.setZone(finnishTimezone),
    quantity,
    priceUsd,
    feeUsd,
  };
}
