// Small wrapper around fetch to keep client-side dashboard mutations consistent.
export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const data = (await response.json()) as T & {error?: string};

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }

  return data;
}
