import { useEffect, useState } from "react";
import {
  getWalletTransactions,
  WalletTransactionDto,
} from "../../../lib/wallet";

const formatTransactionType = (type: string) =>
  type
    .toLowerCase()
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

const getTransactionName = (
  transaction: WalletTransactionDto
) => {
  switch (transaction.type) {
    case "CHALLENGE_REWARD":
      return "Challenge Reward";

    default:
      return transaction.description || "Transaction";
  }
};

export const RecentTransactions = () => {
  const [transactions, setTransactions] = useState<
    WalletTransactionDto[]
  >([]);

  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    if (loading || last) return;

    setLoading(true);

    try {
      const response = await getWalletTransactions(page, 20);

      setTransactions((prev) => [
        ...prev,
        ...response.content,
      ]);

      setLast(response.last);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="rounded-3xl bg-[#1f1f1f] shadow-xl overflow-hidden">
      <div className="border-b border-slate-700 px-6 py-5">
        <h2 className="text-xl font-bold uppercase text-white">
          Recent Transactions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#3a3a3a] text-left text-sm text-slate-200">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">
                Coins Earned
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-slate-400"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-800 text-white hover:bg-slate-900/30"
                >
                  <td className="px-5 py-4 font-medium">
                    {getTransactionName(transaction)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {formatTransactionType(
                      transaction.type
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {transaction.createdAt
                      ? new Date(
                          transaction.createdAt
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td
                    className={`px-5 py-4 text-right font-semibold ${
                      transaction.coinAmount >= 0
                        ? "text-lime-400"
                        : "text-red-400"
                    }`}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>🪙</span>

                      <span>
                        {transaction.coinAmount > 0
                          ? "+"
                          : ""}
                        {transaction.coinAmount}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!last && (
        <div className="flex justify-center p-5">
          <button
            onClick={loadTransactions}
            disabled={loading}
            className="rounded-xl bg-lime-500 px-5 py-2 font-semibold text-black transition hover:bg-lime-400 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};