# Finnish tax report generator for Interactive Brokers

1. Clone this project
2. Download activity statement for the full year as a CSV-file from IB
3. Download EUR/USD daily price data as a CSV-file from
   https://www.investing.com/currencies/eur-usd-historical-data
4. Add a file named `properties.json` to the root of this project, with file
   paths to your downloaded files as follows:

```json
{
  "ibReportPath": "[your path here]",
  "eurUsdPath": "[your path here]"
}
```

5. Install dependencies with `npm install`
6. Execute the program with `npm run start`

## Limitations

- Currently expects the USD as the currency used to buy/sell stocks
- Doesn't handle a situation where a single transaction acts as both an exit and
  an entry
  - For example: You have 1 stock of apple, and you sell 2. This exits the
    previous long position and enters a short position.
  - This situation should be handled by manually editing the CSV file and
    splitting the row into two rows.
