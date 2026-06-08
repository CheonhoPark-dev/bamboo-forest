export type ConsultationResult = {
  category: string;
  concern: string;
  phone: string;
  name: string;
  gender: string;
  birth: string;
  preferredDays: string[];
  preferredTimes: string[];
  privacyAgreed: boolean;
  submittedAt: string;
};

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (let i = 0; i < bytes.length; i += 0x8000) {
    const chunk = bytes.subarray(i, i + 0x8000);
    for (let j = 0; j < chunk.length; j += 1) {
      binary += String.fromCharCode(chunk[j]);
    }
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

export function encodeResultBlob(result: ConsultationResult) {
  return toBase64Url(JSON.stringify(result));
}

export function decodeResultBlob(blob: string): ConsultationResult | null {
  if (!blob.trim()) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(blob));

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      category: String(parsed.category ?? ""),
      concern: String(parsed.concern ?? ""),
      phone: String(parsed.phone ?? ""),
      name: String(parsed.name ?? ""),
      gender: String(parsed.gender ?? ""),
      birth: String(parsed.birth ?? ""),
      preferredDays: Array.isArray(parsed.preferredDays)
        ? parsed.preferredDays.map(String)
        : [],
      preferredTimes: Array.isArray(parsed.preferredTimes)
        ? parsed.preferredTimes.map(String)
        : [],
      privacyAgreed: Boolean(parsed.privacyAgreed),
      submittedAt: String(parsed.submittedAt ?? ""),
    };
  } catch {
    return null;
  }
}
