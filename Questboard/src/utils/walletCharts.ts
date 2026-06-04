// utils/walletChart.ts

import { WalletTransactionDto } from "../lib/wallet";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function buildWeeklyChartData(
  transactions: WalletTransactionDto[]
) {
  const today = new Date();

  const startDate = new Date();
  startDate.setDate(today.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const totals = new Map<string, number>();

  DAYS.forEach((day) => totals.set(day, 0));

  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt);

    if (date < startDate) return;

    const dayName = DAYS[date.getDay()];

    const current = totals.get(dayName) || 0;

    totals.set(
      dayName,
      current + Math.max(transaction.coinAmount, 0)
    );
  });

  return DAYS.map((day) => ({
    day,
    value: totals.get(day) || 0,
  }));
}