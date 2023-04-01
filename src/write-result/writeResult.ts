import * as fs from "fs";
import * as path from "path";
import { State } from "../process-transactions/processTransactions";
import { getProperties } from "../properties";
import { generatePositionsCSV } from "./generatePositionsCSV";
import { generateSummaryCSV } from "./generateSummaryCSV";
import { generateTransactionsCSV } from "./generateTransactionsCSV";

export function writeResult(state: State) {
  const { resultDirPath } = getProperties();

  const transactionsCSV = generateTransactionsCSV(state.handled);
  fs.writeFileSync(
    path.join(resultDirPath, "transactions.csv"),
    transactionsCSV
  );

  const positionsCSV = generatePositionsCSV(state.unclosed);
  fs.writeFileSync(path.join(resultDirPath, "positions.csv"), positionsCSV);

  const summaryCSV = generateSummaryCSV(state.handled);
  fs.writeFileSync(path.join(resultDirPath, "summary.csv"), summaryCSV);
}
