import { parse } from "csv/sync";
import * as fs from "fs";
import { filter, map, pipe } from "remeda";
import { csvRowToTransaction } from "./csvRowToTransaction";
import { getEurUsd } from "./getEurUsd";
import { readProperties } from "./properties";

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
  map(csvRowToTransaction)
);

console.log(transactions.slice(0, 2));

console.log(transactions.map((t) => getEurUsd(t.dateTime)).slice(0, 2));
