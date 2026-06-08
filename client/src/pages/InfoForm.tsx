/**
 * Design: 마음하나 스타일 - Step 2
 * - 밝은 화이트 배경
 * - 깔끔한 카드 기반 폼
 * - 코랄 포인트 색상
 * - 친근하고 부드러운 톤
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { ConsultationSubmissionInput } from "@shared/consultation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const days = ["월", "화", "수", "목", "금", "토", "일"];
const timeSlots = [
  "09:00 - 11:00",
  "11:00 - 13:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
  "17:00 - 19:00",
  "19:00 - 21:00",
];

const birthYears = Array.from({ length: 60 }, (_, i) => 2007 - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

export default function InfoForm() {
  const [, navigate] = useLocation();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [preferredTimes, setPreferredTimes] = useState<string[]>([]);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const toggleDay = (day: string) => {
    setPreferredDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (slot: string) => {
    setPreferredTimes((prev) =>
      prev.includes(slot) ? prev.filter((t) => t !== slot) : [...prev, slot]
    );
  };

  const isFormValid = phone.replace(/\D/g, "").length >= 10 && name.trim() && gender && birthYear && birthMonth && birthDay && preferredDays.length > 0 && preferredTimes.length > 0 && privacyAgreed;

  const clearStoredDraft = () => {
    sessionStorage.removeItem("bamboo_category");
    sessionStorage.removeItem("bamboo_concern");
    sessionStorage.removeItem("bamboo_phone");
    sessionStorage.removeItem("bamboo_name");
    sessionStorage.removeItem("bamboo_gender");
    sessionStorage.removeItem("bamboo_birth");
    sessionStorage.removeItem("bamboo_day");
    sessionStorage.removeItem("bamboo_time");
    sessionStorage.removeItem("bamboo_result_blob");
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    const birth = `${birthYear}-${birthMonth}-${birthDay}`;
    const result: ConsultationSubmissionInput = {
      category: sessionStorage.getItem("bamboo_category") || "",
      concern: sessionStorage.getItem("bamboo_concern") || "",
      phone,
      name,
      gender,
      birth,
      preferredDays,
      preferredTimes,
      privacyAgreed,
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to submit");
      }

      clearStoredDraft();
      toast.success("감사합니다! 제출이 성공적으로 완료되었습니다");
      navigate("/");
    } catch {
      toast.error("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-5 py-4"
      >
        <div className="flex items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-800 pr-5">
            상담 정보 입력
          </h1>
        </div>
      </motion.header>

      {/* Progress */}
      <div className="px-5 pt-4">
        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[#ff6b5a]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#ff6b5a]/30" />
        </div>
        <p className="text-xs text-gray-400 mt-2">2단계 중 2단계</p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 px-5 pt-5 pb-8"
      >
        <div className="space-y-4">
          {/* Phone */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              📱 전화번호
            </Label>
            <Input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              maxLength={13}
              className="border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-800 placeholder:text-gray-400 focus:ring-[#ff6b5a]/30 focus:border-[#ff6b5a]/50"
            />
          </div>

          {/* Name */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              ✏️ 이름
            </Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-800 placeholder:text-gray-400 focus:ring-[#ff6b5a]/30 focus:border-[#ff6b5a]/50"
            />
          </div>

          {/* Gender */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              👤 성별
            </Label>
            <RadioGroup
              value={gender}
              onValueChange={setGender}
              className="flex gap-3"
            >
              <label className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${gender === "male" ? "bg-[#fff0ed] border-[#ff6b5a] text-[#ff6b5a]" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                <RadioGroupItem value="male" id="male" className="sr-only" />
                <span className="text-sm font-medium">남성</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${gender === "female" ? "bg-[#fff0ed] border-[#ff6b5a] text-[#ff6b5a]" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                <RadioGroupItem value="female" id="female" className="sr-only" />
                <span className="text-sm font-medium">여성</span>
              </label>
            </RadioGroup>
          </div>

          {/* Birth Date */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              🎂 생년월일
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Select value={birthYear} onValueChange={setBirthYear}>
                <SelectTrigger className="border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-700">
                  <SelectValue placeholder="년" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {birthYears.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={birthMonth} onValueChange={setBirthMonth}>
                <SelectTrigger className="border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-700">
                  <SelectValue placeholder="월" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={String(month)}>
                      {month}월
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={birthDay} onValueChange={setBirthDay}>
                <SelectTrigger className="border-gray-200 bg-gray-50 rounded-xl h-12 text-gray-700">
                  <SelectValue placeholder="일" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {daysOfMonth.map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      {day}일
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferred Day & Time */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              🕐 희망 시간대
            </Label>
            
            {/* Day Selection */}
            <p className="text-xs text-gray-400 mb-2">요일 선택 (중복 가능)</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`
                    w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200
                    ${preferredDays.includes(day)
                      ? "bg-[#ff6b5a] text-white shadow-sm shadow-[#ff6b5a]/20"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Time Selection - Checkboxes */}
            <p className="text-xs text-gray-400 mb-2">시간대 선택 (중복 가능)</p>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <label
                  key={slot}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                    preferredTimes.includes(slot)
                      ? "bg-[#fff0ed] border-[#ff6b5a]"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={preferredTimes.includes(slot)}
                    onCheckedChange={() => toggleTime(slot)}
                    className="data-[state=checked]:bg-[#ff6b5a] data-[state=checked]:border-[#ff6b5a]"
                  />
                  <span className={`text-xs font-medium ${preferredTimes.includes(slot) ? "text-[#ff6b5a]" : "text-gray-600"}`}>
                    {slot}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Agreement */}
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={privacyAgreed}
              onCheckedChange={(checked) => setPrivacyAgreed(checked === true)}
              className="mt-0.5 data-[state=checked]:bg-[#ff6b5a] data-[state=checked]:border-[#ff6b5a]"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                개인정보 수집 및 이용에 동의합니다
              </span>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                수집 항목: 이름, 전화번호, 성별, 생년월일<br />
                수집 목적: 상담 예약 및 연락<br />
                보유 기간: 상담 완료 후 3개월
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pb-4"
        >
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full py-6 rounded-2xl bg-[#ff6b5a] hover:bg-[#ff5a47] text-white font-semibold text-[15px] shadow-md shadow-[#ff6b5a]/20 border-0 transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:shadow-none"
          >
            {isSubmitting ? "제출 중..." : "상담 신청하기 ✨"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
