import { parse } from "csv/sync";
import { DateTime } from "luxon";
import { mapToObj } from "remeda";
import { readFile } from "./file-util";
import { getProperties } from "./properties";

export type EurUsdMap = Record<string, number | undefined>;

export function getEurUsdMap(): EurUsdMap {
  const path = getProperties().eurUsdPath;

  const rawData: string[][] = parse(
    readFile(path).replaceAll('"', "") // all values are quoted
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
