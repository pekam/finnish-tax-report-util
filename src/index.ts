import { parse } from "csv/sync";
import * as fs from "fs";
import path from "path";
import { filter, pipe } from "remeda";

const propertiesFilePath = path.join(__dirname, "..", "properties.json");

const invalidPropsError = Error(
  'You need to create properties.json file in the project root with content {"ibReportPath": "path_to_your_report"}'
);

if (!fs.existsSync(propertiesFilePath)) {
  throw invalidPropsError;
}

const properties: { ibReportPath?: string } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "properties.json"), "utf8")
);

const ibReportPath = properties.ibReportPath;

if (!ibReportPath) {
  throw invalidPropsError;
}

const data: string[][] = pipe(
  ibReportPath,
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

console.log(stockTradeRows.slice(0, 10));
