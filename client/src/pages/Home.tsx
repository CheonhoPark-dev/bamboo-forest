/**
 * Design: 마음하나 스타일 - 밝고 깨끗한 화이트 배경, 코랄 포인트, 카드 UI
 * - 깔끔한 중앙 정렬 레이아웃
 * - 부드러운 일러스트/아이콘
 * - 친근한 카피라이팅
 * - 넓은 여백과 둥근 모서리
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Compass, Heart, Users, Home as HomeIcon, HelpCircle } from "lucide-react";

const categories = [
  { id: "work", label: "직장", icon: Briefcase, emoji: "💼" },
  { id: "career", label: "진로", icon: Compass, emoji: "🧭" },
  { id: "love", label: "연애", icon: Heart, emoji: "💕" },
  { id: "relationship", label: "인간관계", icon: Users, emoji: "🤝" },
  { id: "family", label: "가정사", icon: HomeIcon, emoji: "🏠" },
  { id: "etc", label: "기타", icon: HelpCircle, emoji: "💭" },
];

export default function Home() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [concern, setConcern] = useState("");

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
  };

  const handleNext = () => {
    if (!selectedCategory || !concern.trim()) return;
    sessionStorage.setItem("bamboo_category", selectedCategory);
    sessionStorage.setItem("bamboo_concern", concern);
    navigate("/info");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-5 py-4"
      >
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">
            <span className="text-[#2d8f6f]">🌿</span> 당신만의 대나무 숲
          </h1>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="px-6 pt-8 pb-6 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          지금, 어떤 고민을<br />하고 있나요?
        </h2>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          사소한 걱정부터 깊은 고민까지,<br />
          어떤 이야기든 여기에 남겨도 괜찮아요.
        </p>
      </motion.section>

      {/* Category Selection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-5 pb-5"
      >
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-1">
          고민 카테고리
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCategorySelect(cat.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-2xl
                  border-2 transition-all duration-200
                  ${isSelected
                    ? "bg-[#fff0ed] border-[#ff6b5a] shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                  }
                `}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className={`text-xs font-medium ${isSelected ? "text-[#ff6b5a]" : "text-gray-600"}`}>
                  {cat.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Concern Text Input */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.section
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="px-5 pb-6"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                당신의 고민을 알려주세요
              </p>
              <Textarea
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                placeholder="지금 떠오르는 고민, 대나무숲에게 들려줄래요?"
                maxLength={500}
                className="min-h-[140px] border-0 bg-gray-50 text-gray-800 placeholder:text-gray-400 rounded-xl p-3.5 text-sm leading-relaxed resize-none focus:ring-1 focus:ring-[#ff6b5a]/30 focus:bg-white transition-all"
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-xs text-gray-300">{concern.length}/500</span>
              </div>
            </div>

            {/* Next Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <Button
                onClick={handleNext}
                disabled={!concern.trim()}
                className="w-full py-6 rounded-2xl bg-[#ff6b5a] hover:bg-[#ff5a47] text-white font-semibold text-[15px] shadow-md shadow-[#ff6b5a]/20 border-0 transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:shadow-none"
              >
                다음 단계로 →
              </Button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Bottom Decoration */}
      {!selectedCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex-1 flex flex-col items-center justify-end pb-12 px-6"
        >
          <div className="text-center">
            <p className="text-6xl mb-4">🎋</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              아무도 당신의 이야기를<br />판단하지 않아요.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
