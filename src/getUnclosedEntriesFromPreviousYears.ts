import { mapValues } from "remeda";

import { DateTime } from "luxon";
import { readFile } from "./file-util";
import { UnclosedEntriesMap } from "./process-transactions/processTransactions";

/**
 * Edit this if you have unclosed positions from previous years. It should
 * return a map where the key is the asset's symbol and the value is a list of
 * transactions which are not closed (or are partially closed, in which case the
 * quantity and balance change should be reduced accordingly), sorted by time so
 * the oldest transactions is first.
 */
export function getUnclosedEntriesFromPreviousYears(): UnclosedEntriesMap {
  return {};
}

/**
 * You can use this if you ran this same report generator last year, by
 * providing path to the 'unclosedEntries.json' file generated back then.
 */
function readLastYearsUnclosedPositionsJSON(
  filePath: string
): UnclosedEntriesMap {
  const parsed = JSON.parse(readFile(filePath));

  // Convert time props from string to DateTime
  return mapValues(parsed, (transactions) =>
    transactions.map((t: any) => ({ ...t, time: DateTime.fromISO(t.time) }))
  );
}
