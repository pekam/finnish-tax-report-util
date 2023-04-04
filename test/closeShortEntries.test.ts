import { process } from "./util";

it("should reduce entry transaction (short)", () => {
  const state = process([
    { quantity: -10, priceUsd: 10 },
    { quantity: 3, priceUsd: 8 },
  ]);

  expect(state).toMatchInlineSnapshot(`
    {
      "handled": [
        {
          "balanceChangeEurExcludingFees": 100,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "priceUsd": 10,
          "quantity": -10,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": -24,
          "closedPnlExcludingFees": 6,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "priceUsd": 8,
          "quantity": 3,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
      ],
      "unclosed": {
        "foo": [
          {
            "balanceChangeEurExcludingFees": 70,
            "closedPnlExcludingFees": 0,
            "eurUsd": 1,
            "feeEur": 1,
            "feeUsd": 1,
            "originalQuantity": -10,
            "priceUsd": 10,
            "remainingQuantity": -7,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
        ],
      },
    }
  `);
});

it("should reduce entry in two parts and remove entry (short)", () => {
  const state = process([
    { quantity: -10, priceUsd: 10 },
    { quantity: 3, priceUsd: 5 },
    { quantity: 7, priceUsd: 11 },
  ]);
  expect(state).toMatchInlineSnapshot(`
    {
      "handled": [
        {
          "balanceChangeEurExcludingFees": 100,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "priceUsd": 10,
          "quantity": -10,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": -15,
          "closedPnlExcludingFees": 15,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "priceUsd": 5,
          "quantity": 3,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": -77,
          "closedPnlExcludingFees": -7,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "priceUsd": 11,
          "quantity": 7,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
      ],
      "unclosed": {},
    }
  `);
});

it("should remove oldest entry and reduce the next entry (short)", () => {
  const state = process([
    { quantity: -2, priceUsd: 5 },
    { quantity: -10, priceUsd: 6 },
    { quantity: 5, priceUsd: 10 },
  ]);

  expect(state).toMatchInlineSnapshot(`
    {
      "handled": [
        {
          "balanceChangeEurExcludingFees": 10,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "priceUsd": 5,
          "quantity": -2,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": 60,
          "closedPnlExcludingFees": 0,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "priceUsd": 6,
          "quantity": -10,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
        {
          "balanceChangeEurExcludingFees": -50,
          "closedPnlExcludingFees": -22,
          "eurUsd": 1,
          "feeEur": 1,
          "feeUsd": 1,
          "priceUsd": 10,
          "quantity": 5,
          "symbol": "foo",
          "time": "2022-01-01T00:00:00.000+02:00",
        },
      ],
      "unclosed": {
        "foo": [
          {
            "balanceChangeEurExcludingFees": 42,
            "closedPnlExcludingFees": 0,
            "eurUsd": 1,
            "feeEur": 1,
            "feeUsd": 1,
            "originalQuantity": -10,
            "priceUsd": 6,
            "remainingQuantity": -7,
            "symbol": "foo",
            "time": "2022-01-01T00:00:00.000+02:00",
          },
        ],
      },
    }
  `);
});

it("should throw when single transaction closes and opens position (short)", () => {
  // Note: This is a valid scenario that should not throw, but handling this
  // case is not supported at the moment. The test exists just to make sure that
  // it throws instead of causing unexpected results.
  expect(() =>
    process([
      { quantity: -2, priceUsd: 5 },
      { quantity: 5, priceUsd: 10 },
    ])
  ).toThrowError();
});
