const DEFAULT_PROXY_URL = "/api/documents/upload";

function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

/**
 * Resolve the upload endpoint.
 * - useProxy: force Next.js proxy (keeps secrets server-side)
 * - uploadUrl: explicit override
 * - NEXT_PUBLIC_DOC_BASE_URL: direct backend upload base (client-safe)
 */
export function getDocumentsUploadUrl({ useProxy = false, uploadUrl } = {}) {
  if (uploadUrl) return uploadUrl;
  if (useProxy) return DEFAULT_PROXY_URL;

  const publicBase = normalizeBaseUrl(process.env.NEXT_PUBLIC_DOC_BASE_URL);
  if (!publicBase) return DEFAULT_PROXY_URL;

  return `${publicBase}/DocumentUpload/upload`;
}
