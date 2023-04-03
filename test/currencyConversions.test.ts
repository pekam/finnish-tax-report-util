import { process } from "./util";

it("should convert balance changes, fees and pnl to euros", () => {
  const state = process(
    [
      { quantity: 10, priceUsd: 5, dateISO: "2022-01-01" },
      { quantity: -3, priceUsd: 10, dateISO: "2022-01-02" },
    ],

    // EUR/USD rates:
    {
      "2022-01-01": 2,
      "2022-01-02": 3,
    }
  );

  expect(state).toMatchInlineSnapshot(`
    {
      "handled": [
        {
          "balanceChangeEurExcludingFees": -25,
          "closedPnlExcludingFees": 0,
          "eurUsd": 2,
          "feeEur": 0.5,
          "feeUsd": 1,
          "priceUsd": 5,
          "quantity": 10,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": 10,
          "closedPnlExcludingFees": 2.5,
          "eurUsd": 3,
          "feeEur": 0.3333333333333333,
          "feeUsd": 1,
          "priceUsd": 10,
          "quantity": -3,
          "symbol": "foo",
          "time": "2022-01-02T00:00:00.000+02:00",
        },
      ],
      "unclosed": {
        "foo": [
          {
            "balanceChangeEurExcludingFees": -25,
            "closedPnlExcludingFees": 0,
            "eurUsd": 2,
            "feeEur": 0.5,
            "feeUsd": 1,
            "priceUsd": 5,
            "quantity": 10,
            "remaining": 7,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
        ],
      },
    }
  `);
});

it("should throw if currency rate not found for transaction date", () => {
  expect(() =>
    process(
      [
        { quantity: 10, priceUsd: 5, dateISO: "2022-01-01" },
        { quantity: -3, priceUsd: 10, dateISO: "2022-01-02" },
      ],
      {
        "2022-01-01": 2,
      }
    )
  ).toThrowError();
});
