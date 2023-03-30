import { parse } from "csv/sync";
import * as fs from "fs";
import { DateTime } from "luxon";
import { mapToObj } from "remeda";
import { readProperties } from "./properties";

const eurUsdDateFormat = "MM/dd/yyyy";

const path = readProperties().eurUsdPath;

const rawData: string[][] = parse(
  fs.readFileSync(path, "utf8").replaceAll('"', "") // all values are quoted
);

export type EurUsdMap = Record<string, number | undefined>;

export function getEurUsdMap(): EurUsdMap {
  return mapToObj(rawData, (row) => [row[0], parseFloat(row[1])]);
}

export function getEurUsdForDate(
  dateTime: DateTime,
  eurUsdMap: EurUsdMap
): number {
  const formattedDate = dateTime.toFormat(eurUsdDateFormat);
  const eurUsd = eurUsdMap[formattedDate];
  if (eurUsd === undefined) {
    throw Error("No EUR/USD price found for date " + formattedDate);
  }
  return eurUsd;
}

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
