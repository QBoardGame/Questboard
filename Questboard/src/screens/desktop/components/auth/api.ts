import { log } from "lib/log";

const AUTH_API_BASE = "http://localhost:8080/api/auth";
const JSON_HEADERS = {
  "Content-Type": "application/json",
};

async function postAuth(endpoint: string, body: Record<string, unknown>) {
  const url = `${AUTH_API_BASE}${endpoint}`;
  log(`Sending auth request to ${url}`, "src/screens/desktop/components/auth/api.ts", "postAuth");

  const response = await fetch(url, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(errorDetail || "Authentication request failed");
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  username: string;
  email: string;
  password: string;
};

export async function loginWithCredentials(credentials: LoginCredentials) {
  return postAuth("/login", {
    ...credentials,
    role: "USER",
  });
}

export async function registerWithCredentials(credentials: SignupCredentials) {
  return postAuth("/register", {
    ...credentials,
    role: "USER",
  });
}
