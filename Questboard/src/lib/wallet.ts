import { apiClient } from "../lib/apiClient";

export type WalletStatsDto = {
  currentCoins: number;
  totalEarnedCoins: number;
  totalSpentCoins: number;
  transactionCount: number;
};

export type WalletTransactionDto = {
  id: string;
  referenceId: string;
  currency: string;
  type: string;
  cashAmount: number | null;
  coinAmount: number;
  balanceAfterCoins: number;
  description: string;
  createdAt: string;
};

export type WalletTransactionPageResponse = {
  content: WalletTransactionDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
};

export async function getWalletStats() {
  return apiClient.get<WalletStatsDto>("/wallet/stats");
}

export async function getWalletTransactions(
  page = 0,
  size = 20
) {
  return apiClient.get<WalletTransactionPageResponse>(
    `/wallet/transactions?page=${page}&size=${size}`
  );
}