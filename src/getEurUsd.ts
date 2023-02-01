import { parse } from "csv/sync";
import * as fs from "fs";
import { DateTime } from "luxon";
import { readProperties } from "./properties";

const eurUsdDateFormat = "MM/dd/yyyy";

const path = readProperties().eurUsdPath;

const rawData: string[][] = parse(
  fs.readFileSync(path, "utf8").replaceAll('"', "") // all values are quoted
);

export function getEurUsd(dateTime: DateTime): number {
  const formattedDate = dateTime.toFormat(eurUsdDateFormat);
  const matchingRow = rawData.find((row) => row[0] === formattedDate);
  if (!matchingRow) {
    throw Error(
      "No EUR/USD price found from the CSV for date " + formattedDate
    );
  }
  return parseFloat(matchingRow[1]);
}
