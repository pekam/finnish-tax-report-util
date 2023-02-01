import { parse } from "csv/sync";
import * as fs from "fs";
import { filter, map, pipe } from "remeda";
import { convertTransaction } from "./convertTransaction";
import { ibTradeRowToObject } from "./ibTradeRowToObject";
import { readProperties } from "./properties";

/**
 * Single row in the output CSV that will be provided to Vero.
 */
export interface Transaction {
  time: string;
  symbol: string;
  quantity: number;

  priceUsd: number;
  priceEur: number;

  feeUsd: number;
  feeEur: number;

  balanceChangeUsd: number;
  balanceChangeEur: number;

  realizedPnlUsd: number;
  realizedPnlEur: number;

  eurUsd: number;
}

const transactions = pipe(
  readProperties().ibReportPath,
  (path) => fs.readFileSync(path, "utf8"),
  (str) =>
    parse(str, {
      relaxColumnCount: true,
      relaxQuotes: true, // Notes in the end of the CSV contain un-escaped quotes
    }),
  filter(
    (row: string[]) =>
      row[0] === "Trades" && row[1] === "Data" && row[3] === "Stocks"
  ),
  map(ibTradeRowToObject),
  map(convertTransaction)
);

console.log(transactions.slice(0, 2));
