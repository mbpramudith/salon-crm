// front-end/src/lib/api-client.ts
import axios, { AxiosResponse, AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
const GRAPHQL_URL = `${API_BASE_URL}/graphql`;

// GraphQL response types
interface GraphQLError {
  message: string;
  path?: string[];
  extensions?: Record<string, unknown>;
}

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLError[];
}

// Helper to get headers
function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key":
      process.env.NEXT_PUBLIC_API_KEY ||
      "super-admin-api-key-change-in-development",
  };

  // Add JWT token if available (for after login)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  console.log("🔑 Sending API Key:", headers["x-api-key"]); // Debug log
  return headers;
}

export async function graphqlQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    console.log("📡 Making GraphQL request to:", GRAPHQL_URL);
    console.log("🔍 Query:", query);
    console.log("📦 Variables:", variables);

    const response: AxiosResponse<GraphQLResponse<T>> = await axios.post(
      GRAPHQL_URL,
      {
        query,
        variables,
      },
      {
        headers: getHeaders(),
        timeout: 10000, // 10 second timeout
      }
    );

    console.log("✅ GraphQL response received");

    if (response.data.errors && response.data.errors.length > 0) {
      const errorMessage = `GraphQL Error: ${response.data.errors[0].message}`;
      console.error("❌ GraphQL errors:", response.data.errors);
      throw new Error(errorMessage);
    }

    if (!response.data.data) {
      throw new Error("GraphQL response missing data");
    }

    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ GraphQL request failed:");

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Status:", axiosError.response.status);
        console.error("Data:", axiosError.response.data);
        console.error("Headers:", axiosError.response.headers);

        if (axiosError.response.status === 401) {
          throw new Error("Unauthorized: Check if API key is valid");
        } else if (axiosError.response.status === 404) {
          throw new Error("Endpoint not found: Check if backend is running");
        } else {
          const errorData = axiosError.response.data as { error?: string };
          throw new Error(
            `HTTP Error ${axiosError.response.status}: ${
              errorData.error || "Unknown error"
            }`
          );
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error("No response received:", axiosError.request);
        throw new Error(
          "No response from server: Check if backend is running on port 4000"
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", axiosError.message);
        throw new Error(`Request failed: ${axiosError.message}`);
      }
    } else if (error instanceof Error) {
      // Generic Error
      console.error("Generic error:", error.message);
      throw new Error(`Request failed: ${error.message}`);
    } else {
      // Unknown error type
      console.error("Unknown error:", error);
      throw new Error("Unknown error occurred during request");
    }
  }
}

export async function graphqlMutation<T = unknown>(
  mutation: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return graphqlQuery<T>(mutation, variables);
}

// REST API helpers (optional)
export async function apiGet<T = unknown>(url: string): Promise<T> {
  const response = await axios.get<T>(`${API_BASE_URL}${url}`, {
    headers: getHeaders(),
  });
  return response.data;
}
