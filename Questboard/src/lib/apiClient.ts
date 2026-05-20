/**
 * API Client with Automatic Token Refresh
 * - Adds accessToken to all request headers
 * - Handles 401 responses by refreshing tokens
 * - Retries failed requests with new token
 */

import { tokenStorage } from "./tokenStorage";
import { log } from "./log";

const API_BASE = "http://localhost:8080/api";

interface ApiResponse<T = unknown> {
  status: number;
  data: T;
}

class ApiClient {
  private refreshPromise: Promise<string> | null = null;

  /**
   * Make an authenticated API request
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const accessToken = tokenStorage.getAccessToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(typeof options.headers === "object" && options.headers
        ? Object.fromEntries(
            Object.entries(options.headers).map(([k, v]) => [k, String(v)])
          )
        : {}),
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthenticated response
    if (response.status === 401) {
      log(
        "Received 401 - attempting token refresh",
        "src/lib/apiClient.ts",
        "request"
      );

      const newAccessToken = await this.refreshAccessToken();

      if (!newAccessToken) {
        throw new Error("Failed to refresh authentication token");
      }

      // Retry the original request with new token
      headers["Authorization"] = `Bearer ${newAccessToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }

    if (!response.ok) {
      const errorDetail = await response.text().catch(() => "Unknown error");
      throw new Error(
        `API request failed: ${response.status} - ${errorDetail}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }

    return null as T;
  }

  /**
   * Refresh access token using refresh token
   * Prevents multiple simultaneous refresh requests
   */
  private async refreshAccessToken(): Promise<string | null> {
    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
          log(
            "No refresh token available",
            "src/lib/apiClient.ts",
            "refreshAccessToken"
          );
          return null;
        }

        const url = `${API_BASE}/auth/refresh`;
        log(`Refreshing token at ${url}`, "src/lib/apiClient.ts", "refreshAccessToken");

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          const errorDetail = await response.text().catch(() => "Unknown error");
          log(
            `Token refresh failed: ${response.status} - ${errorDetail}`,
            "src/lib/apiClient.ts",
            "refreshAccessToken"
          );
          tokenStorage.clearTokens();
          return null;
        }

        const data = await response.json();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

        // Update tokens in storage
        tokenStorage.setTokens(newAccessToken, newRefreshToken);
        log(
          "Token refreshed successfully",
          "src/lib/apiClient.ts",
          "refreshAccessToken"
        );

        return newAccessToken;
      } catch (error) {
        log(
          `Token refresh error: ${error}`,
          "src/lib/apiClient.ts",
          "refreshAccessToken"
        );
        tokenStorage.clearTokens();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * POST request shorthand
   */
  async post<T = unknown>(
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * GET request shorthand
   */
  async get<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  /**
   * PUT request shorthand
   */
  async put<T = unknown>(
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request shorthand
   */
  async delete<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
