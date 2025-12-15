const SECRET = "route-secret-v1"; // keep consistent

export function encodeRouteData(data) {
  const payload = {
    ...data,
    ts: Date.now(),
  };

  const json = JSON.stringify(payload);
  const base64 = btoa(json);

  const signature = btoa(
    Array.from(base64).reduce((acc, char) => acc + char.charCodeAt(0), 0) + SECRET
  );

  return `${base64}.${signature}`;
}

export function decodeRouteData(encoded) {
  try {
    const [base64, signature] = encoded.split(".");
    if (!base64 || !signature) return null;

    const expectedSignature = btoa(
      Array.from(base64).reduce((acc, char) => acc + char.charCodeAt(0), 0) + SECRET
    );

    if (signature !== expectedSignature) return null;

    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
