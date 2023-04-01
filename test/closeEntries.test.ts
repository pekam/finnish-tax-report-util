import { process } from "./util";

it("should reduce entry transaction", () => {
  const state = process([
    { quantity: 10, price: 5 },
    { quantity: -3, price: 10 },
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
          "balanceChangeEurExcludingFees": 30,
          "closedPnlExcludingFees": 15,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "price": 10,
          "quantity": -3,
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
            "remaining": 7,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
        ],
      },
    }
  `);
});

it("should reduce entry in two parts and remove entry", () => {
  const state = process([
    { quantity: 10, price: 5 },
    { quantity: -3, price: 10 },
    { quantity: -7, price: 4 },
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
          "balanceChangeEurExcludingFees": 30,
          "closedPnlExcludingFees": 15,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "price": 10,
          "quantity": -3,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": 28,
          "closedPnlExcludingFees": -7,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "price": 4,
          "quantity": -7,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
      ],
      "unclosed": {},
    }
  `);
});
