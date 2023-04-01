import { process } from "./util";

it("should add transaction to empty state", () => {
  const state = process([{ quantity: 10, price: 5 }]);

  expect(state).toMatchInlineSnapshot(`
    {
      "handled": [
        {
          "balanceChangeEurExcludingFees": -50,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "price": 5,
          "quantity": 10,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
      ],
      "unclosed": {
        "foo": [
          {
            "balanceChangeEurExcludingFees": -50,
            "closedPnlExcludingFees": 0,
            "eurUsd": 1,
            "feeEur": 1,
            "feeUsd": 1,
            "price": 5,
            "quantity": 10,
            "remaining": 10,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
        ],
      },
    }
  `);
});

it("should add buy transaction when unclosed buy exists", () => {
  const state = process([
    { quantity: 10, price: 5 },
    { quantity: 3, price: 6 },
  ]);

  expect(state).toMatchInlineSnapshot(`
    {
      "handled": [
        {
          "balanceChangeEurExcludingFees": -50,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "price": 5,
          "quantity": 10,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": -18,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "price": 6,
          "quantity": 3,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
      ],
      "unclosed": {
        "foo": [
          {
            "balanceChangeEurExcludingFees": -50,
            "closedPnlExcludingFees": 0,
            "eurUsd": 1,
            "feeEur": 1,
            "feeUsd": 1,
            "price": 5,
            "quantity": 10,
            "remaining": 10,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
          {
            "balanceChangeEurExcludingFees": -18,
            "closedPnlExcludingFees": 0,
            "eurUsd": 1,
            "feeEur": 1,
            "feeUsd": 1,
            "price": 6,
            "quantity": 3,
            "remaining": 3,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
        ],
      },
    }
  `);
});

it("should add sell transaction when unclosed sell exists", () => {
  const state = process([
    { quantity: -10, price: 5 },
    { quantity: -5, price: 6 },
  ]);

  expect(state).toMatchInlineSnapshot(`
    {
      "handled": [
        {
          "balanceChangeEurExcludingFees": 50,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "price": 5,
          "quantity": -10,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": 30,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "price": 6,
          "quantity": -5,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
      ],
      "unclosed": {
        "foo": [
          {
            "balanceChangeEurExcludingFees": 50,
            "closedPnlExcludingFees": 0,
            "eurUsd": 1,
            "feeEur": 1,
            "feeUsd": 1,
            "price": 5,
            "quantity": -10,
            "remaining": -10,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
          {
            "balanceChangeEurExcludingFees": 30,
            "closedPnlExcludingFees": 0,
            "eurUsd": 1,
            "feeEur": 1,
            "feeUsd": 1,
            "price": 6,
            "quantity": -5,
            "remaining": -5,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
        ],
      },
    }
  `);
});
