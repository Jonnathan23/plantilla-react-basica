export const COUNTER_OPERATION = {
    INCREMENT: "increment",
    DECREMENT: "decrement",
    RESET: "reset",
} as const;

export type CounterOperation = (typeof COUNTER_OPERATION)[keyof typeof COUNTER_OPERATION];
