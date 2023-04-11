# Finnish tax report util

Currently this project only supports generating reports for stock trades
executed via Interactive Brokers.

## Steps

1. Clone this project
2. Download activity statement for the full year as a CSV-file from Interactive
   Brokers
3. Download EUR/USD daily price data as a CSV-file from
   https://www.investing.com/currencies/eur-usd-historical-data
4. Create an empty directory where the result files will be written
5. Add a file named `properties.json` to the root of this project, with file
   paths to your downloaded files and the result directory you just created:

```json
{
  "ibReportPath": "[your path here]",
  "eurUsdPath": "[your path here]",
  "resultDirPath": "[your path here]"
}
```

6. Install dependencies with `npm install`
7. If you had unclosed positions at the start of the year, edit the
   `getUnclosedEntriesFromPreviousYears.ts` file to provide their entry
   transactions, so they can be used in the FIFO pnl calculations
8. Execute the program with `npm start`

This will generate several files in the result directory:

- `transactions.csv` contains each transaction with profit/loss calculated with
  the FIFO principle and values converted to euros. This data can be included as
  an attachment to the tax report. Unfortunately vero.fi does not support CSV
  format, so you can e.g. import the data to a rick text document as a table.
- `summary.csv` contains the values that need to be reported to vero.fi besides
  the transactions: total sales, total wins and total losses. Fees (commissions)
  are on a separate row. If you want to simply include them to losses (as I
  haven't found a definite answer for where the fees should be reported),
  there's another row that contains the sum of losses and fees.
- `positions.csv` contains the positions left open at the end of the year. These
  need to be reported one by one to vero.fi. The file contains also all the
  entry transactions for those positions (but the same data is also provided in
  JSON format).
- `unclosedEntries.json` contains the entry transactions of open positions which
  will be needed to calculate next year's profits and losses. The data is in
  JSON format so it can be easily parsed.

## Limitations

- Currently expects USD as the currency used to buy/sell stocks
- Doesn't handle a situation where a single transaction acts as both an exit and
  an entry
  - For example: You have 1 stock of Apple, and you sell 2. This exits the
    previous long position and enters a short position.
  - This situation should be handled by manually editing the CSV file and
    splitting the row into two rows.
