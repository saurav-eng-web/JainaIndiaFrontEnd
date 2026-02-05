function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

/**
 * Resolve the upload endpoint.
 * - uploadUrl: explicit override
 * - NEXT_PUBLIC_DOC_BASE_URL: direct backend upload base (client-safe)
 */
export function getDocumentsUploadUrl({ useProxy = false, uploadUrl } = {}) {
  if (uploadUrl) return uploadUrl;

  const publicBase = normalizeBaseUrl(process.env.NEXT_PUBLIC_DOC_BASE_URL);
  if (!publicBase) {
    if (typeof window !== "undefined") {
      console.warn(
        "Missing NEXT_PUBLIC_DOC_BASE_URL. Direct document upload requires it."
      );
    } else {
      console.warn(
        "Missing NEXT_PUBLIC_DOC_BASE_URL. Direct document upload requires it."
      );
    }
    return "";
  }

  return `${publicBase}/DocumentUpload/upload`;
}
