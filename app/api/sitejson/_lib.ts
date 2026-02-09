import { NextResponse } from 'next/server';

const defaultTimeoutMs = 15000;

const parseJson = (text: string): unknown => {
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: {
        code: 'UPSTREAM_INVALID_JSON',
        message: 'Upstream returned invalid JSON',
      },
      raw: text,
    };
  }
};

const getBackendBaseUrl = (): string => {
  return (
    process.env.SITEJSON_API_BASE_URL ??
    process.env.NEXT_PUBLIC_SITEJSON_API_BASE_URL ??
    'http://127.0.0.1:8787'
  );
};

const getTimeoutMs = (): number => {
  const raw = Number(process.env.SITEJSON_PROXY_TIMEOUT_MS ?? defaultTimeoutMs);
  if (Number.isFinite(raw) && raw > 0) {
    return raw;
  }
  return defaultTimeoutMs;
};

const createHeaders = (headers?: HeadersInit): Headers => {
  const merged = new Headers(headers);

  const apiKey = process.env.SITEJSON_API_KEY;
  if (apiKey && apiKey.trim()) {
    merged.set('x-api-key', apiKey);
  }

  if (!merged.has('accept')) {
    merged.set('accept', 'application/json');
  }

  return merged;
};

export const proxyToSitejson = async (path: string, init?: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

  try {
    const upstream = await fetch(`${getBackendBaseUrl()}${path}`, {
      ...init,
      headers: createHeaders(init?.headers),
      signal: controller.signal,
      cache: 'no-store',
    });

    const payloadText = await upstream.text();
    const payload = parseJson(payloadText);

    return NextResponse.json(payload, {
      status: upstream.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'UPSTREAM_UNAVAILABLE',
          message: error instanceof Error ? error.message : 'Failed to reach SiteJSON backend',
        },
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
};
