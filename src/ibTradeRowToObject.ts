import { DateTime } from "luxon";

// TODO is it always this or the exchange time zone of traded asset?
const tradeDataTimeZone = "America/New_York";

export function ibTradeRowToObject(row: string[]) {
  // https://www.ibkrguides.com/reportingreference/reportguide/trades_default.htm
  const [
    currency,
    symbol,
    dateTime,
    quantity,
    tPrice, // transaction price
    cPrice, // closing price
    proceeds, // how much USD balance changed (excl. fee)
    commFee,
    basis,
    realizedPnl,
    mtmPnl,
    code,
  ] = row.slice(4);

  if (currency !== "USD") {
    throw Error(
      "Only USD transactions are supported at the moment, found " + currency
    );
  }

  return {
    symbol,
    currency,
    dateTime: DateTime.fromFormat(dateTime, "yyyy-MM-dd, HH:mm:ss", {
      zone: tradeDataTimeZone,
    }),
    quantity: parseFloat(quantity),
    price: parseFloat(tPrice),
    proceeds: parseFloat(proceeds),
    fee: parseFloat(commFee),
    realizedPnl: parseFloat(realizedPnl),
  };
}
