import { Button } from "@/components/ui/button";
import { decodeResultBlob } from "@/lib/resultBlob";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clipboard, FileJson } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

function getResultBlob() {
  const params = new URLSearchParams(window.location.search);
  return params.get("blob") || sessionStorage.getItem("bamboo_result_blob") || "";
}

export default function Result() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const blob = useMemo(getResultBlob, []);
  const result = useMemo(() => decodeResultBlob(blob), [blob]);
  const rawJson = result ? JSON.stringify(result, null, 2) : "";

  const rows = result
    ? [
        ["category", result.category],
        ["concern", result.concern],
        ["phone", result.phone],
        ["name", result.name],
        ["gender", result.gender],
        ["birth", result.birth],
        ["preferredDays", result.preferredDays.join(", ")],
        ["preferredTimes", result.preferredTimes.join(", ")],
        ["privacyAgreed", String(result.privacyAgreed)],
        ["submittedAt", result.submittedAt],
      ]
    : [];

  const handleCopy = async () => {
    if (!rawJson) return;

    await navigator.clipboard.writeText(rawJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
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
        {!result ? (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[55vh] flex flex-col items-center justify-center text-center"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400">
              <FileJson className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">결과 데이터가 없습니다</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              제출된 결과 blob을 찾지 못했어요.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-6 h-11 rounded-lg bg-[#ff6b5a] px-5 text-white hover:bg-[#ff5a47]"
            >
              처음으로
            </Button>
          </motion.section>
        ) : (
          <div className="space-y-5">
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#2d8f6f]">
                    submitted result
                  </p>
                  <h2 className="text-base font-bold text-gray-900">전체 입력값</h2>
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="h-9 rounded-lg border-gray-200 px-3 text-xs text-gray-700"
                >
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Clipboard className="mr-1.5 h-4 w-4" />
                      JSON 복사
                    </>
                  )}
                </Button>
              </div>

              <dl className="divide-y divide-gray-100">
                {rows.map(([label, value]) => (
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
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-[#202020] rounded-lg overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-white">
                <FileJson className="h-4 w-4 text-[#8bd3b3]" />
                <h2 className="text-sm font-semibold">raw JSON</h2>
              </div>
              <pre className="max-h-[360px] overflow-auto p-4 text-xs leading-relaxed text-[#f4f1eb]">
                {rawJson}
              </pre>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <h2 className="text-sm font-bold text-gray-900">blob</h2>
              </div>
              <p className="max-h-[160px] overflow-auto break-all p-4 text-xs leading-relaxed text-gray-600">
                {blob}
              </p>
            </motion.section>
          </div>
        )}
      </main>
    </div>
  );
}
