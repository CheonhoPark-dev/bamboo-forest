import { Button } from "@/components/ui/button";
import type { ConsultationSubmission } from "@shared/consultation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clipboard,
  Clock,
  Database,
  Folder,
  MessageSquareText,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useLocation } from "wouter";

type SubmissionsResponse = {
  submissions?: ConsultationSubmission[];
  error?: string;
};

const categoryLabels: Record<string, string> = {
  work: "직장",
  career: "진로",
  love: "연애",
  relationship: "인간관계",
  family: "가정사",
  etc: "기타",
};

const genderLabels: Record<string, string> = {
  male: "남성",
  female: "여성",
};

function getCategoryLabel(value: string) {
  return categoryLabels[value] || value || "-";
}

function getGenderLabel(value: string) {
  return genderLabels[value] || value || "-";
}

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

function formatBirth(value: string) {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${year}년 ${month}월 ${day}일`;
}

function formatList(values: string[]) {
  return values.length > 0 ? values : ["-"];
}

function buildCopyText(submission: ConsultationSubmission) {
  return [
    `[상담 신청 결과]`,
    `저장 시각: ${formatDate(submission.savedAt)}`,
    `이름: ${submission.name || "-"}`,
    `전화번호: ${submission.phone || "-"}`,
    `성별: ${getGenderLabel(submission.gender)}`,
    `생년월일: ${formatBirth(submission.birth)}`,
    `고민 카테고리: ${getCategoryLabel(submission.category)}`,
    `고민 내용: ${submission.concern || "-"}`,
    `희망 요일: ${submission.preferredDays.join(", ") || "-"}`,
    `희망 시간: ${submission.preferredTimes.join(", ") || "-"}`,
    `개인정보 동의: ${submission.privacyAgreed ? "동의" : "미동의"}`,
    `제출 시각: ${formatDate(submission.submittedAt)}`,
    `Blob 경로: ${submission.pathname || "-"}`,
  ].join("\n");
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#f3f3ee] text-[#6f6a5c]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400">{label}</p>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm font-semibold leading-relaxed text-gray-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function ChipList({ values }: { values: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {formatList(values).map(value => (
        <span
          key={value}
          className="rounded-lg border border-[#ffd6cc] bg-[#fff3ef] px-2.5 py-1 text-xs font-semibold text-[#d85845]"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

export default function Result() {
  const [, navigate] = useLocation();
  const [submissions, setSubmissions] = useState<ConsultationSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const latestSavedAt = useMemo(() => {
    const latest = submissions[0]?.savedAt;
    return latest ? formatDate(latest) : "-";
  }, [submissions]);

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
      setError(
        err instanceof Error ? err.message : "결과를 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSubmissions();
  }, []);

  const handleCopy = async (submission: ConsultationSubmission) => {
    await navigator.clipboard.writeText(buildCopyText(submission));
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
            상담 신청 결과
          </h1>
        </div>
      </motion.header>

      <main className="flex-1 px-5 py-6">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf7f1] text-[#2d8f6f]">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2d8f6f]">
                  Vercel Blob
                </p>
                <h2 className="text-base font-bold text-gray-900">
                  총 {submissions.length}건
                </h2>
              </div>
            </div>
            <Button
              onClick={() => void loadSubmissions()}
              disabled={isLoading}
              variant="outline"
              className="h-9 rounded-lg border-gray-200 px-3 text-xs text-gray-700"
            >
              <RefreshCw
                className={`mr-1.5 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              새로고침
            </Button>
          </div>
          <div className="border-t border-gray-100 bg-[#fafaf7] px-4 py-3">
            <p className="text-xs font-semibold text-gray-400">최근 저장</p>
            <p className="mt-0.5 text-sm font-bold text-gray-900">
              {latestSavedAt}
            </p>
          </div>
        </motion.section>

        {isLoading ? (
          <div className="min-h-[46vh] flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <section className="min-h-[46vh] flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400">
              <Database className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              결과를 불러오지 못했습니다
            </h2>
            <p className="mt-2 break-words text-sm leading-relaxed text-gray-500">
              {error}
            </p>
          </section>
        ) : submissions.length === 0 ? (
          <section className="min-h-[46vh] flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400">
              <Database className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              저장된 결과가 없습니다
            </h2>
          </section>
        ) : (
          <div className="space-y-5">
            {submissions.map((submission, index) => (
              <motion.article
                key={submission.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3 px-4 py-4">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-[#eaf7f1] px-2.5 py-1 text-xs font-bold text-[#2d8f6f]">
                        {getCategoryLabel(submission.category)}
                      </span>
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                        {formatDate(submission.savedAt)}
                      </span>
                    </div>
                    <h2 className="break-words text-lg font-bold text-gray-900">
                      {submission.name || "이름 없음"}
                    </h2>
                    <p className="mt-1 break-words text-sm font-semibold text-[#d85845]">
                      {submission.phone || "전화번호 없음"}
                    </p>
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
                        복사
                      </>
                    )}
                  </Button>
                </div>

                <section className="border-y border-[#ffe3dc] bg-[#fff8f6] px-4 py-4">
                  <div className="flex items-center gap-2 text-[#d85845]">
                    <MessageSquareText className="h-4 w-4" />
                    <h3 className="text-sm font-bold">고민 내용</h3>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-900">
                    {submission.concern || "-"}
                  </p>
                </section>

                <section className="divide-y divide-gray-100 px-4">
                  <InfoLine
                    icon={UserRound}
                    label="신청자 정보"
                    value={`${getGenderLabel(submission.gender)} · ${formatBirth(submission.birth)}`}
                  />
                  <InfoLine
                    icon={Phone}
                    label="연락처"
                    value={submission.phone}
                  />
                  <InfoLine
                    icon={ShieldCheck}
                    label="개인정보 동의"
                    value={
                      submission.privacyAgreed ? "동의함" : "동의하지 않음"
                    }
                  />
                  <InfoLine
                    icon={CalendarDays}
                    label="제출 시각"
                    value={formatDate(submission.submittedAt)}
                  />
                </section>

                <section className="border-t border-gray-100 px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Clock className="h-4 w-4 text-[#2d8f6f]" />
                    <h3 className="text-sm font-bold">희망 상담 시간</h3>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-gray-400">
                    요일
                  </p>
                  <ChipList values={submission.preferredDays} />
                  <p className="mt-4 text-xs font-semibold text-gray-400">
                    시간대
                  </p>
                  <ChipList values={submission.preferredTimes} />
                </section>

                <section className="border-t border-gray-100 bg-[#fafaf7] px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Folder className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-bold">저장 정보</h3>
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="break-all text-xs leading-relaxed text-gray-500">
                      <span className="font-bold text-gray-700">경로: </span>
                      {submission.pathname || "-"}
                    </p>
                    <p className="break-all text-xs leading-relaxed text-gray-500">
                      <span className="font-bold text-gray-700">URL: </span>
                      {submission.blobUrl || "-"}
                    </p>
                  </div>
                </section>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
