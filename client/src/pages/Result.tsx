import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clipboard, Database, FileJson, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import type { ConsultationSubmission } from "@shared/consultation";

type SubmissionsResponse = {
  submissions?: ConsultationSubmission[];
  error?: string;
};

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getRows(submission: ConsultationSubmission) {
  return [
    ["category", submission.category],
    ["concern", submission.concern],
    ["phone", submission.phone],
    ["name", submission.name],
    ["gender", submission.gender],
    ["birth", submission.birth],
    ["preferredDays", submission.preferredDays.join(", ")],
    ["preferredTimes", submission.preferredTimes.join(", ")],
    ["privacyAgreed", String(submission.privacyAgreed)],
    ["submittedAt", submission.submittedAt],
    ["savedAt", submission.savedAt],
    ["pathname", submission.pathname || ""],
    ["blobUrl", submission.blobUrl || ""],
  ];
}

export default function Result() {
  const [, navigate] = useLocation();
  const [submissions, setSubmissions] = useState<ConsultationSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const countLabel = useMemo(() => `${submissions.length}건`, [submissions.length]);

  const loadSubmissions = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/submissions", {
        cache: "no-store",
      });
      const data = (await response.json()) as SubmissionsResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to load submissions");
      }

      setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "결과를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSubmissions();
  }, []);

  const handleCopy = async (submission: ConsultationSubmission) => {
    await navigator.clipboard.writeText(JSON.stringify(submission, null, 2));
    setCopiedId(submission.id);
    window.setTimeout(() => setCopiedId(""), 1400);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f4] flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-100 px-5 py-4"
      >
        <div className="flex items-center">
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="처음으로"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900 pr-9">
            결과 확인
          </h1>
        </div>
      </motion.header>

      <main className="flex-1 px-5 py-6">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 bg-white border border-gray-100 rounded-lg shadow-sm px-4 py-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf7f1] text-[#2d8f6f]">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2d8f6f]">
                  vercel blob
                </p>
                <h2 className="text-base font-bold text-gray-900">{countLabel}</h2>
              </div>
            </div>
            <Button
              onClick={() => void loadSubmissions()}
              disabled={isLoading}
              variant="outline"
              className="h-9 rounded-lg border-gray-200 px-3 text-xs text-gray-700"
            >
              <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>
        </motion.section>

        {isLoading ? (
          <div className="min-h-[46vh] flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <section className="min-h-[46vh] flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400">
              <FileJson className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">결과를 불러오지 못했습니다</h2>
            <p className="mt-2 break-words text-sm leading-relaxed text-gray-500">{error}</p>
          </section>
        ) : submissions.length === 0 ? (
          <section className="min-h-[46vh] flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400">
              <FileJson className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">저장된 결과가 없습니다</h2>
          </section>
        ) : (
          <div className="space-y-5">
            {submissions.map((submission, index) => {
              const rawJson = JSON.stringify(submission, null, 2);

              return (
                <motion.article
                  key={submission.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
                    <div className="min-w-0">
                      <p className="break-words text-xs font-semibold uppercase tracking-wide text-[#2d8f6f]">
                        {formatDate(submission.savedAt)}
                      </p>
                      <h2 className="mt-1 break-words text-base font-bold text-gray-900">
                        {submission.name || "이름 없음"}
                      </h2>
                    </div>
                    <Button
                      onClick={() => void handleCopy(submission)}
                      variant="outline"
                      className="h-9 flex-none rounded-lg border-gray-200 px-3 text-xs text-gray-700"
                    >
                      {copiedId === submission.id ? (
                        <>
                          <Check className="mr-1.5 h-4 w-4" />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Clipboard className="mr-1.5 h-4 w-4" />
                          JSON
                        </>
                      )}
                    </Button>
                  </div>

                  <dl className="divide-y divide-gray-100">
                    {getRows(submission).map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[118px_1fr] gap-3 px-4 py-3">
                        <dt className="break-words text-xs font-semibold text-gray-400">
                          {label}
                        </dt>
                        <dd className="whitespace-pre-wrap break-words text-sm font-medium leading-relaxed text-gray-900">
                          {value || "-"}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="bg-[#202020]">
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-white">
                      <FileJson className="h-4 w-4 text-[#8bd3b3]" />
                      <h3 className="text-sm font-semibold">raw JSON</h3>
                    </div>
                    <pre className="max-h-[360px] overflow-auto p-4 text-xs leading-relaxed text-[#f4f1eb]">
                      {rawJson}
                    </pre>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
