import { get, list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import type {
  ConsultationSubmission,
  ConsultationSubmissionInput,
} from "../shared/consultation";

const SUBMISSION_PREFIX = "submissions/";
const BLOB_ACCESS = process.env.BLOB_ACCESS === "private" ? "private" : "public";
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init?.headers || {}),
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

async function readBlobJson(pathname: string) {
  const result = await get(pathname, {
    access: BLOB_ACCESS,
    useCache: false,
  });

  if (!result || result.statusCode !== 200) {
    return null;
  }

  return new Response(result.stream).json();
}

function normalizeSubmissionInput(value: unknown): ConsultationSubmissionInput | null {
  if (!isRecord(value)) return null;

  const submission = {
    category: String(value.category ?? ""),
    concern: String(value.concern ?? ""),
    phone: String(value.phone ?? ""),
    name: String(value.name ?? ""),
    gender: String(value.gender ?? ""),
    birth: String(value.birth ?? ""),
    preferredDays: toStringArray(value.preferredDays),
    preferredTimes: toStringArray(value.preferredTimes),
    privacyAgreed: Boolean(value.privacyAgreed),
    submittedAt: String(value.submittedAt ?? ""),
  };

  if (!submission.phone || !submission.name || !submission.privacyAgreed) {
    return null;
  }

  return submission;
}

function normalizeStoredSubmission(
  value: unknown,
  metadata: Pick<ConsultationSubmission, "blobUrl" | "pathname">,
): ConsultationSubmission | null {
  if (!isRecord(value)) return null;

  return {
    id: String(value.id ?? metadata.pathname ?? ""),
    category: String(value.category ?? ""),
    concern: String(value.concern ?? ""),
    phone: String(value.phone ?? ""),
    name: String(value.name ?? ""),
    gender: String(value.gender ?? ""),
    birth: String(value.birth ?? ""),
    preferredDays: toStringArray(value.preferredDays),
    preferredTimes: toStringArray(value.preferredTimes),
    privacyAgreed: Boolean(value.privacyAgreed),
    submittedAt: String(value.submittedAt ?? ""),
    savedAt: String(value.savedAt ?? ""),
    blobUrl: metadata.blobUrl,
    pathname: metadata.pathname,
  };
}

export async function POST(request: Request) {
  try {
    const input = normalizeSubmissionInput(await request.json());

    if (!input) {
      return json({ error: "Invalid submission" }, { status: 400 });
    }

    const savedAt = new Date().toISOString();
    const id = randomUUID();
    const submission: ConsultationSubmission = {
      id,
      ...input,
      savedAt,
    };
    const pathname = `${SUBMISSION_PREFIX}${savedAt.replace(/[-:.TZ]/g, "")}-${id}.json`;
    const blob = await put(pathname, JSON.stringify(submission, null, 2), {
      access: BLOB_ACCESS,
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return json(
      {
        ok: true,
        submission: {
          ...submission,
          blobUrl: blob.url,
          pathname: blob.pathname,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to store submission",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: SUBMISSION_PREFIX,
      limit: 100,
    });

    const submissions = (
      await Promise.all(
        blobs.map(async (blob) => {
          try {
            const stored = await readBlobJson(blob.pathname);
            return normalizeStoredSubmission(stored, {
              blobUrl: blob.url,
              pathname: blob.pathname,
            });
          } catch {
            return null;
          }
        }),
      )
    )
      .filter((submission): submission is ConsultationSubmission => Boolean(submission))
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

    return json({ submissions });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to load submissions",
      },
      { status: 500 },
    );
  }
}
