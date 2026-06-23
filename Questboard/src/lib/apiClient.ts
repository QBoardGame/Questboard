import { log } from './log';
import { tokenStorage } from './tokenStorage';

const API_BASE = process.env.API_URL;

type JsonRecord = Record<string, unknown>;

class ApiClient {
  private refreshPromise: Promise<string | null> | null = null;

  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const accessToken = tokenStorage.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(typeof options.headers === 'object' && options.headers
        ? Object.fromEntries(
            Object.entries(options.headers).map(([key, value]) => [
              key,
              String(value),
            ]),
          )
        : {}),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (
      (response.status === 401 || response.status === 403) &&
      endpoint !== '/auth/refresh'
    ) {
      log(
        `Received ${response.status} - refreshing access token`,
        'src/lib/apiClient.ts',
        'request',
      );

      const refreshedAccessToken = await this.refreshAccessToken();

      if (!refreshedAccessToken) {
        throw new Error('Unauthorized');
      }

      headers.Authorization = `Bearer ${refreshedAccessToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }

    if (!response.ok) {
      const errorDetail = await response.text().catch(() => 'Unknown error');
      throw new Error(
        `API request failed: ${response.status} - ${errorDetail}`,
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    return null as T;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
          return null;
        }

        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          const errorDetail = await response
            .text()
            .catch(() => 'Unknown error');
          log(
            `Token refresh failed: ${response.status} - ${errorDetail}`,
            'src/lib/apiClient.ts',
            'refreshAccessToken',
          );
          tokenStorage.clearTokens();
          return null;
        }

        const data = (await response.json()) as JsonRecord;
        const newAccessToken = String(data.accessToken ?? '');
        const newRefreshToken = String(data.refreshToken ?? '');

        if (!newAccessToken || !newRefreshToken) {
          tokenStorage.clearTokens();
          return null;
        }

        tokenStorage.setTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
      } catch (error) {
        log(
          `Token refresh error: ${error}`,
          'src/lib/apiClient.ts',
          'refreshAccessToken',
        );
        tokenStorage.clearAccessToken();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async post<T = unknown>(
    endpoint: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async get<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async put<T = unknown>(
    endpoint: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async refreshToken(): Promise<string | null> {
    return this.refreshAccessToken();
  }
}

export const apiClient = new ApiClient();
