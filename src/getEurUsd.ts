import { parse } from "csv/sync";
import * as fs from "fs";
import { DateTime } from "luxon";
import { mapToObj } from "remeda";
import { readProperties } from "./properties";

export type EurUsdMap = Record<string, number | undefined>;

export function getEurUsdMap(): EurUsdMap {
  const path = readProperties().eurUsdPath;

  const rawData: string[][] = parse(
    fs.readFileSync(path, "utf8").replaceAll('"', "") // all values are quoted
  );

  return mapToObj(rawData, (row) => [
    convertDateFormatToISO(row[0]),
    parseFloat(row[1]),
  ]);
}

export function getEurUsd(dateTime: DateTime, eurUsdMap: EurUsdMap): number {
  const dateStr = dateTime.toISODate();
  const eurUsd = eurUsdMap[dateStr];
  if (eurUsd === undefined) {
    throw Error("No EUR/USD price found for date " + dateStr);
  }
  return eurUsd;
}

function convertDateFormatToISO(date: string): string {
  return DateTime.fromFormat(date, "MM/dd/yyyy").toISODate();
}
