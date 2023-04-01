import * as fs from "fs";
import * as path from "path";
import { State } from "../process-transactions/processTransactions";
import { readProperties } from "../properties";
import { generateTransactionsCSV } from "./generateTransactionsCSV";

export function writeResult(state: State) {
  const { resultDirPath } = readProperties();

  const transactionsCSV = generateTransactionsCSV(state.handled);

  fs.writeFileSync(
    path.join(resultDirPath, "transactions.csv"),
    transactionsCSV
  );
}
