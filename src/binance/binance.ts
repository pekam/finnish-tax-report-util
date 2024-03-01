import { parse } from "csv/sync";
import * as fs from "fs";
import { groupBy, pipe, sumBy } from "remeda";
import { writeToResultDir } from "../file-util";
import { getProperties } from "../properties";

type RawBinanceTransaction = {
  "Currency name": string;
  "Currency amount": string;
  Acquired: string;
  Sold: string;
  "Proceeds (EUR)": string;
  "Cost basis (EUR)": string;
  "Gains (EUR)": string;
  "Holding period (Days)": string;
  "Transaction type": string;
  Label: string;
};

function run() {
  //@ts-ignore
  const data: {
    fees: RawBinanceTransaction[];
    winningTrades: RawBinanceTransaction[];
    losingTrades: RawBinanceTransaction[];
  } = pipe(
    getProperties().binanceReportPath,
    (path) => fs.readFileSync(path, "utf8"),
    (str): RawBinanceTransaction[] =>
      parse(str, {
        columns: true,
      }),
    groupBy((t) => {
      const type = t["Transaction type"];
      if (type === "Fee") {
        return "fees";
      }
      if (type === "Trade") {
        return parseFloat(t["Gains (EUR)"]) >= 0
          ? "winningTrades"
          : "losingTrades";
      }
      throw Error("Unhandled transaction type: " + type);
    })
  );

  const result = {
    winningTrades: getSummary(data.winningTrades),
    losingTrades: getSummary(data.losingTrades),
    fees: sumColumn("Proceeds (EUR)")(data.fees),
  };
  console.log(result);
  writeToResultDir(
    "binance-summary.json",
    JSON.stringify(result, undefined, 2)
  );
}

function getSummary(transactions: RawBinanceTransaction[]) {
  return {
    myyntihinta: sumColumn("Proceeds (EUR)")(transactions),
    hankintahinta: sumColumn("Cost basis (EUR)")(transactions),
    profit: sumColumn("Gains (EUR)")(transactions),
  };
}

const sumColumn = (column: keyof RawBinanceTransaction) =>
  sumBy<RawBinanceTransaction>((transaction) =>
    parseFloat(transaction[column])
  );

run();
