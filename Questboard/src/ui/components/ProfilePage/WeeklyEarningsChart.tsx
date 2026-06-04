import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  getWalletTransactions,
  WalletTransactionDto,
} from "../../../lib/wallet";

import { buildWeeklyChartData } from "../../../utils/walletCharts";

export const WeeklyEarningsChart = () => {
  const [data, setData] = useState<
    { day: string; value: number }[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);

      // fetch enough recent transactions
      const response = await getWalletTransactions(0, 100);

      const chartData = buildWeeklyChartData(
        response.content
      );

      setData(chartData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-[#1e1e1e] p-6 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#1e1e1e] p-6 text-white">
      <h3 className="mb-4 text-xl font-bold uppercase">
        Weekly Earnings
      </h3>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#9FE870"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};