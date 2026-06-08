/**
 * Design: 마음하나 스타일 - 완료 페이지
 * - 밝고 깨끗한 배경
 * - 귀여운 이모지 + 따뜻한 메시지
 * - 부드러운 애니메이션
 */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Complete() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    setName(sessionStorage.getItem("bamboo_name") || "");
    setDay(sessionStorage.getItem("bamboo_day") || "");
    setTime(sessionStorage.getItem("bamboo_time") || "");
  }, []);

  const handleGoHome = () => {
    sessionStorage.removeItem("bamboo_category");
    sessionStorage.removeItem("bamboo_concern");
    sessionStorage.removeItem("bamboo_phone");
    sessionStorage.removeItem("bamboo_name");
    sessionStorage.removeItem("bamboo_gender");
    sessionStorage.removeItem("bamboo_birth");
    sessionStorage.removeItem("bamboo_day");
    sessionStorage.removeItem("bamboo_time");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-5 py-4">
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-bold text-gray-800">
            <span className="text-[#2d8f6f]">🌿</span> 당신만의 대나무 숲
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          className="text-7xl mb-6"
        >
          🎋
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-gray-900 text-center"
        >
          상담 신청이 완료되었어요!
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-sm text-gray-500 text-center leading-relaxed"
        >
          {name ? `${name}님, ` : ""}곧 연락드릴게요.<br />
          대나무 숲이 당신의 이야기를 기다리고 있어요.
        </motion.p>

        {/* Info Card */}
        {(day || time) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm w-full max-w-[300px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🕐</span>
              <span className="text-sm font-semibold text-gray-700">희망 상담 시간</span>
            </div>
            <p className="text-sm text-gray-600 pl-6">
              매주 <span className="font-semibold text-[#ff6b5a]">{day}요일</span> {time}
            </p>
          </motion.div>
        )}

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 w-full max-w-[300px]"
        >
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full py-5 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200 active:scale-[0.97]"
          >
            처음으로 돌아가기
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
