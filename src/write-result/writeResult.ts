import { writeToResultDir } from "../file-util";
import { State } from "../process-transactions/processTransactions";
import { generatePositionsCSV } from "./generatePositionsCSV";
import { generateSummaryCSV } from "./generateSummaryCSV";
import { generateTransactionsCSV } from "./generateTransactionsCSV";

export function writeResult(state: State) {
  const transactionsCSV = generateTransactionsCSV(state.handled);
  writeToResultDir("transactions.csv", transactionsCSV);

  const positionsCSV = generatePositionsCSV(state.unclosed);
  writeToResultDir("positions.csv", positionsCSV);

  const summaryCSV = generateSummaryCSV(state.handled);
  writeToResultDir("summary.csv", summaryCSV);

  const unclosedEntriesJSON = JSON.stringify(state.unclosed, undefined, 2);
  writeToResultDir("unclosedEntries.json", unclosedEntriesJSON);
}
