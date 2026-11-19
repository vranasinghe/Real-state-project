const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export const modelUrl = (path) => `${base}/api/${path}`;

export async function modelRequest(path, body, signal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 30000);
  try {
    const response = await fetch(modelUrl(path), {
      signal: controller.signal,
      ...(body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      const detail = Array.isArray(data?.detail) ? data.detail.map(d => `${d.loc.at(-1)}: ${d.msg}`).join('; ') : data?.detail;
      throw new Error(detail || 'The model service could not complete this request. Please try again.');
    }
    return data;
  } catch (error) {
    if (error instanceof TypeError || error.name === 'AbortError') throw new Error('The model service is unavailable or took too long. Please try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
