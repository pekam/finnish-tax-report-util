import { parse } from "csv/sync";
import * as fs from "fs";
import { DateTime } from "luxon";
import { filter, pipe } from "remeda";
import { getEurUsd } from "./getEurUsd";
import { readProperties } from "./properties";

// TODO is it always this or the exchange time zone of traded asset?
const tradeDataTimeZone = "America/New_York";

const data: string[][] = pipe(
  readProperties().ibReportPath,
  (path) => fs.readFileSync(path, "utf8"),
  (str) =>
    parse(str, {
      relaxColumnCount: true,
      relaxQuotes: true, // Notes in the end of the CSV contain un-escaped quotes
    })
);

const stockTradeRows = pipe(
  data,
  filter(
    (row) => row[0] === "Trades" && row[1] === "Data" && row[3] === "Stocks"
  )
);

const transactions = stockTradeRows.map((row) => {
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
});

console.log(transactions.slice(0, 2));

console.log(transactions.map((t) => getEurUsd(t.dateTime)).slice(0, 2));
