import { BASE_URL } from "./config";

type Result<T, E = Error> =
    | { ok: true; data: T }
    | { ok: false; error: E }
    | { ok: false; aborted: true };

export const request = async <T>(
    url: string,
    options: { method?: string; body?: unknown; signal?: AbortSignal } = {}
): Promise<Result<T>> => {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: options.method ?? "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: options.signal
        });

        if (!response.ok) {
            return { ok: false, error: new Error(`HTTP ${response.status}`) };
        }

        const data = (await response.json()) as T;
        return { ok: true, data };
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            return { ok: false, aborted: true };
        }

        return {
            ok: false,
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }
};
