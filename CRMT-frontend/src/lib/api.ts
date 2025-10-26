import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8081";

const client: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage on each request if present
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const token = localStorage.getItem("crmt_token");
    if (token) {
      // headers in InternalAxiosRequestConfig are a plain object at this point
      (config.headers as Record<string, any>) = (config.headers as Record<string, any>) || {};
      (config.headers as Record<string, any>)["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Global response interceptor to handle auth errors
client.interceptors.response.use(
  (res) => res,
  (err) => {
    try {
      const status = err?.response?.status;
      if (status === 401) {
        // clear token and user and redirect to login
        try { localStorage.removeItem("crmt_token"); localStorage.removeItem("crmt_user"); } catch(e){}
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } catch (e) {}
    return Promise.reject(err);
  }
);

async function parseResponse<T = any>(promise: Promise<any>) {
  try {
    const res = await promise;
    return { ok: true, status: res.status, body: res.data, raw: res };
  } catch (err: any) {
    // axios: if err.response exists => server responded with status
    if (err.response) {
      return { ok: false, status: err.response.status, body: err.response.data, raw: err.response };
    }

    // No response -> network error or CORS/preflight blocked the request
    const reqUrl = (err && err.config && (err.config.baseURL || "") + (err.config.url || "")) || API_BASE;
    const hint = `Network Error when contacting ${reqUrl}. This often means the backend is unreachable or the request was blocked by CORS. Check that the backend is running at ${API_BASE} and that CORS allows your frontend origin (see backend CorsConfig).`;
    return { ok: false, status: 0, body: hint, raw: err };
  }

}

export function get(path: string, config?: AxiosRequestConfig) {
  return parseResponse(client.get(path, config));
}

export function getParties(role?: string, page = 0, size = 50, query?: string) {
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (typeof page === "number") params.set("page", String(page));
  if (typeof size === "number") params.set("size", String(size));
  if (query) params.set("query", query);
  const path = `/api/parties?${params.toString()}`;
  return parseResponse(client.get(path));
}

export function postJson(path: string, data: any, config?: AxiosRequestConfig) {
  return parseResponse(client.post(path, data, config));
}

export function putJson(path: string, data: any, config?: AxiosRequestConfig) {
  return parseResponse(client.put(path, data, config));
}

export function postForm(path: string, form: FormData, config?: AxiosRequestConfig) {
  const cfg = { headers: { "Content-Type": "multipart/form-data" }, ...(config ?? {}) };
  return parseResponse(client.post(path, form, cfg));
}

export function deleteResource(path: string, config?: AxiosRequestConfig) {
  return parseResponse(client.delete(path, config));
}

export default { client, API_BASE, get, postJson, putJson, postForm, delete: deleteResource };
