/**
 * SwarSaarthi — Home Word Interactive Teaser
 *
 * An interactive live-preview component on the landing page allowing
 * visitors to sample Hindi practice words with TTS speech output and visualizer feedback.
 */

"use client";

import { useState } from "react";
import { speakHindi } from "@/lib/audioRecorder";
import TiltCard from "@/components/TiltCard";

const SAMPLE_WORDS = [
  { text: "नमस्ते", transliteration: "Namaste", meaning: "Hello / Greetings", icon: "🙏", category: "Greeting" },
  { text: "धन्यवाद", transliteration: "Dhanyavaad", meaning: "Thank You", icon: "💐", category: "Courtesy" },
  { text: "मित्र", transliteration: "Mitra", meaning: "Friend", icon: "🤝", category: "Social" },
  { text: "आशा", transliteration: "Aasha", meaning: "Hope", icon: "🌟", category: "Emotion" },
];

export default function HomeWordTeaser() {
  const [activeWord, setActiveWord] = useState(SAMPLE_WORDS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

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
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="text-center mb-6">
        <span className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          ✨ Live Interactive Demo
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Try Listening to Sample Words
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Click any word card below to hear clear, gentle Hindi pronunciation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLE_WORDS.map((item) => {
          const isSelected = activeWord.text === item.text;
          return (
            <TiltCard key={item.text} maxTilt={10}>
              <button
                onClick={() => {
                  setActiveWord(item);
                  handlePlayAudio(item.text);
                }}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? "bg-linear-to-br from-white to-primary-50 border-primary shadow-md ring-2 ring-primary/20"
                    : "bg-white border-primary-100 hover:border-primary-200 hover:shadow-sm"
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-warm-sand text-text-secondary">
                    {item.category}
                  </span>
                </div>

                {/* Main Word */}
                <div className="mb-2">
                  <h4 className="text-3xl font-bold font-hindi text-text-primary group-hover:text-primary transition-colors">
                    {item.text}
                  </h4>
                  <p className="text-xs font-medium text-primary-dark">
                    {item.transliteration}
                  </p>
                </div>

                <p className="text-xs text-text-muted mb-4">
                  {item.meaning}
                </p>

                {/* Listen Action Button */}
                <div className="flex items-center gap-2 pt-2 border-t border-primary-100/60 text-xs font-semibold text-primary">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${isPlaying && isSelected ? 'bg-primary text-white scale-110' : 'bg-primary-50 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                    {isPlaying && isSelected ? "🔊" : "▶"}
                  </div>
                  <span>{isPlaying && isSelected ? "Listening..." : "Tap to Listen"}</span>
                </div>

                {/* Playing Visualizer Bar */}
                {isPlaying && isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent animate-pulse" />
                )}
              </button>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
