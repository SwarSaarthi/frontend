/**
 * SwarSaarthi — Home Word Interactive Teaser
 *
 * An interactive live-preview component on the landing page allowing
 * visitors to sample Hindi practice words with TTS speech output and visualizer feedback.
 * Fully responsive to language toggle (English ↔ Hindi).
 */

"use client";

import { useState } from "react";
import { speakHindi } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import TiltCard from "@/components/TiltCard";

const SAMPLE_WORDS = [
  {
    text: "नमस्ते",
    transliteration: "Namaste",
    meaning: { en: "Hello / Greetings", hi: "नमस्कार / अभिवादन" },
    icon: "🙏",
    category: { en: "Greeting", hi: "अभिवादन" },
  },
  {
    text: "धन्यवाद",
    transliteration: "Dhanyavaad",
    meaning: { en: "Thank You", hi: "धन्यवाद" },
    icon: "💐",
    category: { en: "Courtesy", hi: "शिष्टाचार" },
  },
  {
    text: "मित्र",
    transliteration: "Mitra",
    meaning: { en: "Friend", hi: "मित्र / सखा" },
    icon: "🤝",
    category: { en: "Social", hi: "सामाजिक" },
  },
  {
    text: "आशा",
    transliteration: "Aasha",
    meaning: { en: "Hope", hi: "उम्मीद / आशा" },
    icon: "🌟",
    category: { en: "Emotion", hi: "भावना" },
  },
];

export default function HomeWordTeaser() {
  const [activeWord, setActiveWord] = useState(SAMPLE_WORDS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const { lang } = useLanguage();

  const isHindi = lang === "hi";

  const handlePlayAudio = async (wordText: string) => {
    setIsPlaying(true);
    try {
      await speakHindi(wordText, 0.75);
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SAMPLE_WORDS.map((item) => {
          const isSelected = activeWord.text === item.text;
          const categoryText = isHindi ? item.category.hi : item.category.en;
          const meaningText = isHindi ? item.meaning.hi : item.meaning.en;

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
                {/* Centered Real-Color Mic Logo Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-8xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    🎙️
                  </span>
                </div>

                {/* Top Right Category Tag */}
                <div className="flex items-center justify-end mb-4 relative z-10">
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-primary-50 text-primary border border-primary-100/60 shadow-xs">
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
                    {isPlaying && isSelected ? "🔊" : "▶"}
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
                {isPlaying && isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary to-accent animate-pulse" />
                )}
              </button>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
