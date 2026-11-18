/**
 * SwarSaarthi — Home Word Interactive Teaser
 *
 * An interactive live-preview component on the landing page allowing
 * visitors to sample Hindi practice words with TTS speech output and visualizer feedback.
 * Fully responsive to language toggle (English ↔ Hindi).
 * Zero emojis, clean inline SVG icons, calm articulation-friendly motion.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { speakHindi } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import TtsSpeedControl, { useTtsSpeed } from "@/components/TtsSpeedControl";
import TiltCard from "@/components/TiltCard";

function NamasteIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4c-1.5 2.5-3 5.5-3 8.5 0 2.5 1.3 4.5 3 4.5s3-2 3-4.5C15 9.5 13.5 6.5 12 4z" />
      <path d="M9 12.5c-2 0-3.5 1.5-3.5 3.5 0 2.2 2 4 4.5 4" />
      <path d="M15 12.5c2 0 3.5 1.5 3.5 3.5 0 2.2-2 4-4.5 4" />
    </svg>
  );
}

function GratitudeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function FriendshipIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HopeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function SoundwaveWatermark({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor">
      <circle cx="60" cy="60" r="16" strokeWidth="1.2" strokeOpacity="0.4" />
      <circle cx="60" cy="60" r="32" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="4 4" />
      <circle cx="60" cy="60" r="48" strokeWidth="1.2" strokeOpacity="0.2" />
      <path d="M44 60h4M52 54v12M56 48v24M60 42v36M64 48v24M68 54v12M72 60h4" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function SpeakerWaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function AnimatedWaveformBar() {
  const bars = [4, 9, 6, 11, 7, 10, 5, 8, 11, 6, 9, 4];
  return (
    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#fbeee4] overflow-hidden flex items-end justify-center gap-1 px-4 pb-0.5 z-20">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-1 bg-[#c45c3e] rounded-full"
          animate={{
            height: ["2px", `${h}px`, "2px"],
          }}
          transition={{
            duration: 0.7 + (i % 4) * 0.12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: [0.22, 1, 0.36, 1],
            delay: (i * 0.05) % 0.3,
          }}
        />
      ))}
    </div>
  );
}

const SAMPLE_WORDS = [
  {
    text: "नमस्ते",
    transliteration: "Namaste",
    meaning: { en: "Hello / Greetings", hi: "नमस्कार / अभिवादन" },
    Icon: NamasteIcon,
    category: { en: "Greeting", hi: "अभिवादन" },
  },
  {
    text: "धन्यवाद",
    transliteration: "Dhanyavaad",
    meaning: { en: "Thank You", hi: "धन्यवाद" },
    Icon: GratitudeIcon,
    category: { en: "Courtesy", hi: "शिष्टाचार" },
  },
  {
    text: "मित्र",
    transliteration: "Mitra",
    meaning: { en: "Friend", hi: "मित्र / सखा" },
    Icon: FriendshipIcon,
    category: { en: "Social", hi: "सामाजिक" },
  },
  {
    text: "आशा",
    transliteration: "Aasha",
    meaning: { en: "Hope", hi: "उम्मीद / आशा" },
    Icon: HopeIcon,
    category: { en: "Emotion", hi: "भावना" },
  },
];

export default function HomeWordTeaser() {
  const [activeWord, setActiveWord] = useState(SAMPLE_WORDS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useTtsSpeed();
  const { lang } = useLanguage();

  const isHindi = lang === "hi";

  const handlePlayAudio = async (wordText: string, playSpeed?: number) => {
    setIsPlaying(true);
    try {
      await speakHindi(wordText, playSpeed ?? speed);
    } catch {
      // Gracefully handle browser speech fallback
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 font-sans">
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-4xl font-extrabold text-zinc-900">
          {isHindi
            ? "नमूना शब्दों का उच्चारण सुनें"
            : "Try Listening to Sample Words"}
        </h3>
        <p className="text-sm sm:text-base text-zinc-800 mt-1 font-medium">
          {isHindi
            ? "स्पष्ट हिंदी उच्चारण सुनने के लिए नीचे किसी भी शब्द कार्ड पर क्लिक करें"
            : "Click any word card below to hear clear, gentle Hindi pronunciation"}
        </p>
        <div className="flex justify-center mt-4">
          <TtsSpeedControl
            speed={speed}
            onSpeedSelect={(newSpeed) => {
              setSpeed(newSpeed);
              handlePlayAudio(activeWord.text, newSpeed);
            }}
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SAMPLE_WORDS.map((item) => {
          const isSelected = activeWord.text === item.text;
          const categoryText = isHindi ? item.category.hi : item.category.en;
          const meaningText = isHindi ? item.meaning.hi : item.meaning.en;
          const WordIcon = item.Icon;

          return (
            <TiltCard key={item.text} maxTilt={10}>
              <button
                onClick={() => {
                  setActiveWord(item);
                  handlePlayAudio(item.text);
                }}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? "bg-white/85 backdrop-blur-md border-primary shadow-xl ring-2 ring-primary/30"
                    : "bg-white/50 backdrop-blur-md border-white/80 hover:border-primary-200 hover:bg-white/70 hover:shadow-lg"
                }`}
              >
                {/* Subtle SVG Soundwave Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 text-[#c45c3e]/15 group-hover:text-[#c45c3e]/30 group-hover:scale-110 transition-all duration-500">
                  <SoundwaveWatermark />
                </div>

                {/* Top Right Category Tag with clean SVG */}
                <div className="flex items-center justify-end mb-4 relative z-10">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-primary-50 text-primary border border-primary-100/60 shadow-xs flex items-center gap-1.5">
                    <WordIcon className="w-3 h-3 text-[#c45c3e]" />
                    {categoryText}
                  </span>
                </div>

                {/* Main Word */}
                <div className="mb-3 relative z-10">
                  <h4 className="text-3xl font-extrabold font-hindi text-zinc-900 group-hover:text-primary transition-colors">
                    {item.text}
                  </h4>
                  <p className="text-xs font-bold text-primary-dark">
                    {item.transliteration}
                  </p>
                </div>

                <p className="text-xs text-zinc-900 font-medium mb-4 relative z-10">
                  {meaningText}
                </p>

                {/* Listen Action Button */}
                <div className="flex items-center gap-2 pt-3 border-t border-primary-200/50 text-xs font-bold text-primary relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                      isPlaying && isSelected
                        ? "bg-primary text-white scale-110 shadow-md"
                        : "bg-primary-50 text-primary group-hover:bg-primary group-hover:text-white"
                    }`}
                  >
                    {isPlaying && isSelected ? <SpeakerWaveIcon /> : <PlayIcon />}
                  </div>
                  <span>
                    {isPlaying && isSelected
                      ? isHindi
                        ? "सुन रहे हैं..."
                        : "Listening..."
                      : isHindi
                        ? "सुनने के लिए टैप करें"
                        : "Tap to Listen"}
                  </span>
                </div>

                {/* Playing Visualizer Bar */}
                {isPlaying && isSelected && <AnimatedWaveformBar />}
              </button>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
