import * as fs from "fs";
import * as path from "path";
import { State } from "../process-transactions/processTransactions";
import { getProperties } from "../properties";
import { generatePositionsCSV } from "./generatePositionsCSV";
import { generateSummaryCSV } from "./generateSummaryCSV";
import { generateTransactionsCSV } from "./generateTransactionsCSV";

export function writeResult(state: State) {
  const { resultDirPath } = getProperties();

  const writeToResultDir = (fileName: string, content: string) =>
    fs.writeFileSync(path.join(resultDirPath, fileName), content);

  const transactionsCSV = generateTransactionsCSV(state.handled);
  writeToResultDir("transactions.csv", transactionsCSV);

  const positionsCSV = generatePositionsCSV(state.unclosed);
  writeToResultDir("positions.csv", positionsCSV);

  const summaryCSV = generateSummaryCSV(state.handled);
  writeToResultDir("summary.csv", summaryCSV);

  const unclosedEntriesJSON = JSON.stringify(state.unclosed, undefined, 2);
  writeToResultDir("unclosedEntries.json", unclosedEntriesJSON);
}
