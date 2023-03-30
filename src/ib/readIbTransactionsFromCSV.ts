import { parse } from "csv/sync";
import * as fs from "fs";
import { filter, map, pipe, sortBy } from "remeda";
import { readProperties } from "../properties";
import { convertTransaction } from "./convertTransaction";
import { ibTradeRowToObject } from "./ibTradeRowToObject";

export function readIbTransactionsFromCSV() {
  return pipe(
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
    map(convertTransaction),
    sortBy((t) => t.time)
  );
}
