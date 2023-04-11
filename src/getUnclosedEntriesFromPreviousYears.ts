import { HandledTransaction } from ".";

/**
 * Edit this if you have unclosed positions from previous years. It should
 * return a map where the key is the asset's symbol and the value is a list of
 * transactions which are not closed (or are partially closed, in which case the
 * quantity and balance change should be reduced accordingly), sorted by time so
 * the oldest transactions is first.
 */
export function getUnclosedEntriesFromPreviousYears(): {
  [key: string]: HandledTransaction[];
} {
  return {};
}
