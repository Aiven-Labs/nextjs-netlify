export default async function fetcher<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
}
