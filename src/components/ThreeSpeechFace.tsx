"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import * as THREE from "three";
import { speakHindi, stopSpeaking } from "@/lib/audioRecorder";

export interface ThreeSpeechFaceProps {
  word?: string;
  isSpeaking?: boolean;
  speed?: number;
  className?: string;
  lang?: "en" | "hi";
}

/* ════════════════════════════════════════════════════════════════
   EMBEDDED HIGH-RES RGBA CHARACTER TEXTURE (FROM TARGET IMAGE 1)
   ════════════════════════════════════════════════════════════════ */
const AVATAR_DATA_URI =
  "data:image/webp;base64,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";

/* ════════════════════════════════════════════════════════════════
   MATH HELPERS
   ════════════════════════════════════════════════════════════════ */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ════════════════════════════════════════════════════════════════
   MOUTH POSE (THE "VISEME" ARTICULATION MODEL)
   ════════════════════════════════════════════════════════════════ */
interface Pose {
  jaw: number; // jaw drop (0 – 0.36)
  width: number; // mouth width multiplier (0.58 pucker … 1.36 spread)
  pucker: number; // lip rounding / 3D protrusion (0 – 1)
  smile: number; // mouth-corner lift (-0.15 – 1.15)
  upper: number; // extra upper-lip lift (shows upper teeth)
  close: number; // 1 = lips pressed shut (bilabials: प फ ब भ म / P B M)
  tuck: number; // 1 = lower lip tucked under upper teeth (labiodental: व फ़ / F V)
  tY: number; // tongue height (-0.3 floor … 1.0 alveolar ridge/teeth)
  tZ: number; // tongue reach (-0.5 velar back … 1.0 tip at front teeth)
  curl: number; // retroflex curl (0 – 1: ट ठ ड ढ ण र ऋ)
}

const POSE_KEYS: (keyof Pose)[] = [
  "jaw",
  "width",
  "pucker",
  "smile",
  "upper",
  "close",
  "tuck",
  "tY",
  "tZ",
  "curl",
];

const BASE_POSE: Pose = {
  jaw: 0,
  width: 1,
  pucker: 0,
  smile: 0.2,
  upper: 0,
  close: 0,
  tuck: 0,
  tY: 0,
  tZ: 0.3,
  curl: 0,
};
const mk = (o: Partial<Pose>): Pose => ({ ...BASE_POSE, ...o });
const REST_POSE: Pose = mk({ smile: 0.55 });

function mixPose(a: Pose, b: Pose, t: number): Pose {
  const r: Pose = { ...a };
  for (const k of POSE_KEYS) r[k] = a[k] + (b[k] - a[k]) * t;
  return r;
}

/* ── Vowels ─────────────────────────────────────────────────── */
type VowelId =
  | "a"
  | "aa"
  | "i"
  | "ii"
  | "u"
  | "uu"
  | "e"
  | "ai"
  | "o"
  | "au"
  | "ri";

interface VowelDef {
  pose: Pose;
  name: string;
  labelHi: string;
  symbol: string;
  long: boolean;
}

const VOWELS: Record<VowelId, VowelDef> = {
  a: {
    pose: mk({
      jaw: 0.14,
      width: 1.0,
      smile: 0.3,
      upper: 0.012,
      tY: 0.05,
      tZ: 0.2,
    }),
    name: "Short A (schwa)",
    labelHi: "ह्रस्व अ",
    symbol: "अ",
    long: false,
  },
  aa: {
    pose: mk({
      jaw: 0.33,
      width: 1.06,
      smile: 0.24,
      upper: 0.032,
      tY: -0.22,
      tZ: 0.1,
    }),
    name: "Open A (wide jaw)",
    labelHi: "आ — खुला मुख",
    symbol: "आ",
    long: true,
  },
  i: {
    pose: mk({
      jaw: 0.08,
      width: 1.24,
      smile: 0.95,
      upper: 0.03,
      tY: 0.78,
      tZ: 0.6,
    }),
    name: "Short I (spread)",
    labelHi: "इ — होंठ फैले",
    symbol: "इ",
    long: false,
  },
  ii: {
    pose: mk({
      jaw: 0.09,
      width: 1.32,
      smile: 1.08,
      upper: 0.036,
      tY: 0.85,
      tZ: 0.68,
    }),
    name: "Long I (smile)",
    labelHi: "ई — दीर्घ मुस्कान",
    symbol: "ई",
    long: true,
  },
  u: {
    pose: mk({
      jaw: 0.11,
      width: 0.66,
      pucker: 0.92,
      smile: 0.0,
      upper: 0.01,
      tY: 0.42,
      tZ: 0.1,
    }),
    name: "Short U (rounded)",
    labelHi: "उ — गोल होंठ",
    symbol: "उ",
    long: false,
  },
  uu: {
    pose: mk({
      jaw: 0.1,
      width: 0.6,
      pucker: 1.0,
      smile: -0.05,
      upper: 0.01,
      tY: 0.48,
      tZ: 0.05,
    }),
    name: "Long U (rounded)",
    labelHi: "ऊ — दीर्घ गोल होंठ",
    symbol: "ऊ",
    long: true,
  },
  e: {
    pose: mk({
      jaw: 0.17,
      width: 1.18,
      smile: 0.72,
      upper: 0.03,
      tY: 0.55,
      tZ: 0.52,
    }),
    name: "Mid E",
    labelHi: "ए",
    symbol: "ए",
    long: true,
  },
  ai: {
    pose: mk({
      jaw: 0.26,
      width: 1.14,
      smile: 0.55,
      upper: 0.035,
      tY: 0.18,
      tZ: 0.35,
    }),
    name: "AI diphthong",
    labelHi: "ऐ",
    symbol: "ऐ",
    long: true,
  },
  o: {
    pose: mk({
      jaw: 0.2,
      width: 0.7,
      pucker: 0.85,
      smile: 0.0,
      upper: 0.015,
      tY: 0.15,
      tZ: 0.1,
    }),
    name: "Rounded O",
    labelHi: "ओ — गोल होंठ",
    symbol: "ओ",
    long: true,
  },
  au: {
    pose: mk({
      jaw: 0.27,
      width: 0.76,
      pucker: 0.68,
      smile: 0.05,
      upper: 0.02,
      tY: -0.05,
      tZ: 0.1,
    }),
    name: "AU diphthong",
    labelHi: "औ",
    symbol: "औ",
    long: true,
  },
  ri: {
    pose: mk({
      jaw: 0.12,
      width: 1.08,
      smile: 0.55,
      upper: 0.022,
      tY: 0.82,
      tZ: 0.45,
      curl: 0.82,
    }),
    name: "Vocalic R",
    labelHi: "ऋ",
    symbol: "ऋ",
    long: false,
  },
};

const MATRA: Record<string, VowelId> = {
  "ा": "aa",
  "ि": "i",
  "ी": "ii",
  "ु": "u",
  "ू": "uu",
  "ृ": "ri",
  "ॄ": "ri",
  "ॅ": "ai",
  "ॆ": "e",
  "े": "e",
  "ै": "ai",
  "ॉ": "au",
  "ॊ": "o",
  "ो": "o",
  "ौ": "au",
};

const INDEP: Record<string, VowelId> = {
  अ: "a",
  आ: "aa",
  इ: "i",
  ई: "ii",
  उ: "u",
  ऊ: "uu",
  ऋ: "ri",
  ऌ: "ri",
  ऍ: "ai",
  ऎ: "e",
  ए: "e",
  ऐ: "ai",
  ऑ: "au",
  ऒ: "o",
  ओ: "o",
  औ: "au",
};

const LATIN_VOWEL: Record<string, VowelId> = {
  a: "a",
  e: "e",
  i: "i",
  o: "o",
  u: "u",
};

/* ── Consonants (by place of articulation) ──────────────────── */
type Place =
  | "bilabial"
  | "labiodental"
  | "dental"
  | "retroflex"
  | "velar"
  | "palatal"
  | "sibilant"
  | "rhotic"
  | "glottal";

interface ConsDef {
  name: string;
  labelHi: string;
  jaw: number;
  close: number;
  tuck: number;
  tY: number;
  tZ: number;
  curl: number;
  upper: number;
  width: number | null;
  glottal?: boolean;
}

const CONS: Record<Place, ConsDef> = {
  bilabial: {
    name: "Bilabial (lips closed)",
    labelHi: "ओष्ठ्य (होंठ बंद)",
    jaw: 0.01,
    close: 1,
    tuck: 0,
    tY: 0.1,
    tZ: 0.3,
    curl: 0,
    upper: 0,
    width: null,
  },
  labiodental: {
    name: "Labiodental (lip to teeth)",
    labelHi: "दन्तोष्ठ्य (दांत-होंठ)",
    jaw: 0.06,
    close: 0,
    tuck: 1,
    tY: 0.15,
    tZ: 0.25,
    curl: 0,
    upper: 0.028,
    width: 0.96,
  },
  dental: {
    name: "Dental (tongue on teeth)",
    labelHi: "दन्त्य (जीभ दांतों पर)",
    jaw: 0.11,
    close: 0,
    tuck: 0,
    tY: 0.95,
    tZ: 1.0,
    curl: 0,
    upper: 0.028,
    width: 1.08,
  },
  retroflex: {
    name: "Retroflex (tongue curled)",
    labelHi: "मूर्धन्य (जीभ तालु पर)",
    jaw: 0.13,
    close: 0,
    tuck: 0,
    tY: 0.98,
    tZ: 0.55,
    curl: 1,
    upper: 0.024,
    width: 1.02,
  },
  velar: {
    name: "Velar (back of tongue)",
    labelHi: "कण्ठ्य (गला)",
    jaw: 0.15,
    close: 0,
    tuck: 0,
    tY: 0.62,
    tZ: -0.4,
    curl: 0,
    upper: 0.015,
    width: null,
  },
  palatal: {
    name: "Palatal (tongue to palate)",
    labelHi: "तालव्य",
    jaw: 0.09,
    close: 0,
    tuck: 0,
    tY: 0.84,
    tZ: 0.45,
    curl: 0,
    upper: 0.028,
    width: 1.16,
  },
  sibilant: {
    name: "Sibilant (teeth gap)",
    labelHi: "ऊष्म (दांतों के बीच हवा)",
    jaw: 0.065,
    close: 0,
    tuck: 0,
    tY: 0.72,
    tZ: 0.82,
    curl: 0,
    upper: 0.03,
    width: 1.15,
  },
  rhotic: {
    name: "Rhotic (tongue tip trill)",
    labelHi: "र (जीभ का कंपन)",
    jaw: 0.12,
    close: 0,
    tuck: 0,
    tY: 0.88,
    tZ: 0.5,
    curl: 0.65,
    upper: 0.02,
    width: null,
  },
  glottal: {
    name: "Glottal (breath)",
    labelHi: "काकल्य (ह)",
    jaw: 0.14,
    close: 0,
    tuck: 0,
    tY: 0,
    tZ: 0,
    curl: 0,
    upper: 0.015,
    width: null,
    glottal: true,
  },
};

const DENTAL = new Set([
  0x0924, 0x0925, 0x0926, 0x0927, 0x0928, 0x0929, 0x0932,
]);
const RETRO = new Set([
  0x091f, 0x0920, 0x0921, 0x0922, 0x0923, 0x0933, 0x095c, 0x095d,
]);
const VELAR = new Set([
  0x0915, 0x0916, 0x0917, 0x0918, 0x0919, 0x0958, 0x0959, 0x095a,
]);
const PALATAL = new Set([
  0x091a, 0x091b, 0x091c, 0x091d, 0x091e, 0x092f, 0x095b, 0x095f,
]);
const ASPIRATED = new Set([
  0x0916, 0x0918, 0x091b, 0x091d, 0x0920, 0x0922, 0x0925, 0x0927, 0x092b,
  0x092d,
]);

function placeOfDeva(c: number): Place | null {
  if (c >= 0x092a && c <= 0x092e) return "bilabial"; // प फ ब भ म
  if (c === 0x095e || c === 0x0935) return "labiodental"; // फ़ व
  if (DENTAL.has(c)) return "dental";
  if (RETRO.has(c)) return "retroflex";
  if (VELAR.has(c)) return "velar";
  if (PALATAL.has(c)) return "palatal";
  if (c === 0x0936 || c === 0x0937 || c === 0x0938) return "sibilant"; // श ष स
  if (c === 0x0930 || c === 0x0931) return "rhotic"; // र ऱ
  if (c === 0x0939) return "glottal"; // ह
  return null;
}

const LATIN_PLACE: Record<string, Place> = {
  p: "bilabial",
  b: "bilabial",
  m: "bilabial",
  f: "labiodental",
  v: "labiodental",
  w: "labiodental",
  t: "dental",
  d: "dental",
  n: "dental",
  l: "dental",
  k: "velar",
  g: "velar",
  q: "velar",
  c: "velar",
  x: "sibilant",
  j: "palatal",
  y: "palatal",
  s: "sibilant",
  z: "sibilant",
  r: "rhotic",
  h: "glottal",
};

function composeConsonant(place: Place, v: Pose, aspirated = false): Pose {
  const c = CONS[place];
  const jawBase = c.glottal
    ? v.jaw * 0.85
    : c.close
      ? 0.01
      : Math.max(c.jaw, c.jaw + (v.jaw - c.jaw) * 0.32);
  const jaw = aspirated && !c.close ? jawBase + 0.025 : jawBase;
  const width = c.width === null ? v.width : (v.width + c.width) * 0.5;
  return mk({
    jaw,
    width,
    pucker: v.pucker * (c.close ? 0.35 : 0.82),
    smile: c.close ? v.smile * 0.5 : v.smile,
    upper: c.close ? 0 : Math.max(c.upper, v.upper * 0.55),
    close: c.close,
    tuck: c.tuck,
    tY: c.glottal ? v.tY : c.tY,
    tZ: c.glottal ? v.tZ : c.tZ,
    curl: c.curl,
  });
}

/* ── Phoneme Tokenizer: Devanagari + Digraph-Aware Latin ────── */
type Token =
  | { kind: "C"; place: Place; v: VowelId | null; ch: string; asp?: boolean }
  | { kind: "V"; v: VowelId; ch?: string }
  | { kind: "N" }
  | { kind: "H" }
  | { kind: "P" };

function matchLatinVowelCluster(
  chars: string[],
  idx: number,
): { v: VowelId; len: number; raw: string } | null {
  const c0 = (chars[idx] || "").toLowerCase();
  const c1 = (chars[idx + 1] || "").toLowerCase();
  const pair = c0 + c1;
  if (pair === "aa") return { v: "aa", len: 2, raw: pair };
  if (pair === "ee" || pair === "ea" || pair === "ie")
    return { v: "ii", len: 2, raw: pair };
  if (pair === "oo") return { v: "uu", len: 2, raw: pair };
  if (pair === "ai" || pair === "ay" || pair === "ei")
    return { v: "ai", len: 2, raw: pair };
  if (pair === "au" || pair === "aw" || pair === "ou" || pair === "ow")
    return { v: "au", len: 2, raw: pair };
  if (pair === "oa" || pair === "oe") return { v: "o", len: 2, raw: pair };
  const single = LATIN_VOWEL[c0];
  if (single) return { v: single, len: 1, raw: c0 };
  return null;
}

function matchLatinConsCluster(
  chars: string[],
  idx: number,
): { place: Place; len: number; raw: string; asp?: boolean } | null {
  const c0 = (chars[idx] || "").toLowerCase();
  const c1 = (chars[idx + 1] || "").toLowerCase();
  const pair = c0 + c1;
  if (pair === "sh") return { place: "sibilant", len: 2, raw: "sh" };
  if (pair === "ch") return { place: "palatal", len: 2, raw: "ch" };
  if (pair === "th") return { place: "dental", len: 2, raw: "th", asp: true };
  if (pair === "ph") return { place: "labiodental", len: 2, raw: "ph" };
  if (pair === "wh") return { place: "labiodental", len: 2, raw: "wh" };
  if (pair === "ng" || pair === "nk" || pair === "ck" || pair === "qu")
    return { place: "velar", len: 2, raw: pair };
  if (
    pair === "bh" ||
    pair === "dh" ||
    pair === "gh" ||
    pair === "jh" ||
    pair === "kh"
  ) {
    const p = LATIN_PLACE[c0] || "velar";
    return { place: p, len: 2, raw: pair, asp: true };
  }
  const p0 = LATIN_PLACE[c0];
  if (p0) {
    // Collapse geminate double letters like 'll', 'tt', 'mm', 'pp', 'ss'
    if (c1 === c0) return { place: p0, len: 2, raw: pair };
    return { place: p0, len: 1, raw: c0 };
  }
  return null;
}

function tokenize(word: string): Token[] {
  const chars = Array.from((word || "").trim());
  const out: Token[] = [];
  const n = chars.length;
  const isSep = (s?: string) => s === undefined || /[\s,.;:!?।|—\-]/.test(s);
  let i = 0;

  while (i < n) {
    const ch = chars[i];
    const code = ch.codePointAt(0) || 0;

    if (isSep(ch)) {
      if (out.length && out[out.length - 1].kind !== "P")
        out.push({ kind: "P" });
      i++;
      continue;
    }

    // 1. Devanagari consonants
    const place = code >= 0x0900 && code <= 0x097f ? placeOfDeva(code) : null;
    if (place) {
      const asp = ASPIRATED.has(code);
      let j = i + 1;
      if (chars[j] === "़") j++; // nukta
      const nx = chars[j];
      if (nx === "्") {
        // Special common conjuncts: क्ष (k+sh), त्र (t+r), ज्ञ (j+ny)
        out.push({ kind: "C", place, v: null, ch, asp });
        i = j + 1;
        continue;
      }
      const mv = nx ? MATRA[nx] : undefined;
      if (mv) {
        out.push({ kind: "C", place, v: mv, ch: ch + nx, asp });
        i = j + 1;
        continue;
      }
      // Inherent 'a': deleted at word end (unless single-letter word or preceded by virama conjunct)
      const prevWasConjunct =
        out.length > 0 &&
        out[out.length - 1].kind === "C" &&
        (out[out.length - 1] as { v: VowelId | null }).v === null;
      const singleLetterWord = isSep(chars[i - 1]) && isSep(nx);
      const keepFinalSchwa = singleLetterWord || prevWasConjunct;
      out.push({
        kind: "C",
        place,
        v: isSep(nx) && !keepFinalSchwa ? null : "a",
        ch,
        asp,
      });
      i = j;
      continue;
    }

    // 2. Devanagari independent vowels & modifiers
    const iv = INDEP[ch];
    if (iv) {
      out.push({ kind: "V", v: iv, ch });
      i++;
      continue;
    }
    if (ch === "ं" || ch === "ँ") {
      out.push({ kind: "N" });
      i++;
      continue;
    }
    if (ch === "ः") {
      out.push({ kind: "H" });
      i++;
      continue;
    }

    // 3. Digraph-aware Latin / English / Hinglish
    const vCluster = matchLatinVowelCluster(chars, i);
    if (vCluster) {
      // Check silent trailing 'e' at end of multi-letter English word (e.g., "smile", "make", "phone")
      const isTrailingSilentE =
        vCluster.len === 1 &&
        vCluster.raw === "e" &&
        isSep(chars[i + 1]) &&
        out.length >= 1 &&
        out.some((tk) => tk.kind === "V" || (tk.kind === "C" && tk.v !== null));
      if (!isTrailingSilentE) {
        out.push({ kind: "V", v: vCluster.v, ch: vCluster.raw });
      }
      i += vCluster.len;
      continue;
    }

    const cCluster = matchLatinConsCluster(chars, i);
    if (cCluster) {
      const nextIdx = i + cCluster.len;
      const nextV = matchLatinVowelCluster(chars, nextIdx);
      // If followed by a non-silent vowel, bind CV syllable for natural co-articulation!
      const nextIsSilentE =
        nextV &&
        nextV.len === 1 &&
        nextV.raw === "e" &&
        isSep(chars[nextIdx + 1]) &&
        out.some((tk) => tk.kind === "V" || (tk.kind === "C" && tk.v !== null));
      if (nextV && !nextIsSilentE) {
        out.push({
          kind: "C",
          place: cCluster.place,
          v: nextV.v,
          ch: cCluster.raw + nextV.raw,
          asp: cCluster.asp,
        });
        i = nextIdx + nextV.len;
      } else {
        out.push({
          kind: "C",
          place: cCluster.place,
          v: null,
          ch: cCluster.raw,
          asp: cCluster.asp,
        });
        i = nextIdx;
      }
      continue;
    }

    i++;
  }
  return out;
}

/* ── Timeline of Keyframes ──────────────────────────────────── */
interface Key {
  pose: Pose;
  dur: number; // in units (1 unit ≈ 0.15s at speed 1)
  name: string;
  labelHi: string;
  symbol: string;
  isClosure?: boolean;
  isRhotic?: boolean;
}

interface Timeline {
  keys: Key[];
  starts: number[];
  total: number;
}

function buildTimeline(word: string): Timeline {
  let tokens = tokenize(word);
  if (!tokens.length) {
    tokens = [
      { kind: "V", v: "aa", ch: "आ" },
      { kind: "V", v: "ii", ch: "ई" },
      { kind: "V", v: "uu", ch: "ऊ" },
    ];
  }

  const keys: Key[] = [];
  let lastV: VowelId = "a";

  const nextVowel = (k: number): VowelId => {
    for (let m = k + 1; m < tokens.length; m++) {
      const t = tokens[m];
      if (t.kind === "V") return t.v;
      if (t.kind === "C" && t.v) return t.v;
      if (t.kind === "P") break;
    }
    return lastV;
  };

  const vowelDur = (v: VowelId) =>
    VOWELS[v].long ? 1.05 : v === "a" ? 0.62 : 0.82;

  const pushVowel = (v: VowelId, symOverride?: string) => {
    const d = VOWELS[v];
    keys.push({
      pose: d.pose,
      dur: vowelDur(v),
      name: d.name,
      labelHi: d.labelHi,
      symbol: symOverride || d.symbol,
      isRhotic: v === "ri",
    });
    lastV = v;
  };

  tokens.forEach((t, k) => {
    if (t.kind === "C") {
      const vId = t.v ?? nextVowel(k);
      const def = CONS[t.place];
      const isBilabialOrLabio =
        t.place === "bilabial" || t.place === "labiodental";
      keys.push({
        pose: composeConsonant(t.place, VOWELS[vId].pose, t.asp),
        dur: t.v
          ? isBilabialOrLabio
            ? 0.48
            : 0.42
          : isBilabialOrLabio
            ? 0.52
            : 0.34,
        name: def.name,
        labelHi: def.labelHi,
        symbol: t.ch,
        isClosure: isBilabialOrLabio,
        isRhotic: t.place === "rhotic",
      });
      if (t.v) pushVowel(t.v, t.ch);
    } else if (t.kind === "V") {
      pushVowel(t.v, t.ch);
    } else if (t.kind === "N") {
      keys.push({
        pose: mixPose(
          VOWELS[lastV].pose,
          mk({ jaw: 0.06, tY: 0.68, tZ: 0.55, smile: 0.35 }),
          0.65,
        ),
        dur: 0.35,
        name: "Nasal (Anusvara)",
        labelHi: "अनुनासिक (ं)",
        symbol: "ं",
      });
    } else if (t.kind === "H") {
      const vp = VOWELS[lastV].pose;
      keys.push({
        pose: { ...vp, jaw: Math.max(0.12, vp.jaw * 0.82) },
        dur: 0.35,
        name: "Aspirate (Visarga)",
        labelHi: "विसर्ग (ः)",
        symbol: "ः",
      });
    } else {
      keys.push({
        pose: REST_POSE,
        dur: 0.42,
        name: "Pause",
        labelHi: "विराम",
        symbol: "",
      });
    }
  });

  keys.push({
    pose: REST_POSE,
    dur: 0.85,
    name: "Natural Rest",
    labelHi: "आराम स्थिति",
    symbol: "",
  });

  const starts: number[] = [];
  let acc = 0;
  for (const k of keys) {
    starts.push(acc);
    acc += k.dur;
  }
  return { keys, starts, total: acc };
}

function sampleTimeline(tl: Timeline, t: number): { pose: Pose; key: Key } {
  const { keys, starts } = tl;
  let i = 0;
  while (i < keys.length - 1 && t >= starts[i + 1]) i++;
  const k = keys[i];
  const nxt = i < keys.length - 1 ? keys[i + 1] : k;
  const u = clamp((t - starts[i]) / k.dur, 0, 1);

  // Co-articulated transition:
  // - Bilabial/labiodental closures lock firmly for the first 58% of their window, then pop crisply into the vowel
  // - Vowels have a natural bell-shaped syllable energy arc and glide smoothly into the next target
  const holdSplit = k.isClosure ? 0.58 : 0.44;
  const e = smooth(holdSplit, 1.0, u);
  const blended = mixPose(k.pose, nxt.pose, e);

  // Add subtle natural syllable stress arc on open vowels & trill flutter on rhotics
  const arc = Math.sin(u * Math.PI);
  if (!k.isClosure && k.pose.jaw > 0.12) {
    blended.jaw = clamp(blended.jaw * (1.0 + 0.08 * arc), 0, 0.36);
  }
  if (k.isRhotic) {
    blended.tY = clamp(
      blended.tY + 0.08 * Math.sin(u * Math.PI * 6),
      -0.3,
      1.0,
    );
  }

  return { pose: blended, key: u < 0.72 ? k : nxt };
}

/* ════════════════════════════════════════════════════════════════
   EXACT TARGET IMAGE 1 ANATOMICAL 3D RELIEF & SEAM GEOMETRY
   (Calibrated to the 580 × 502 reference portrait)
   ════════════════════════════════════════════════════════════════ */
const IMG_W = 580.0;
const IMG_H = 502.0;
const SCALE = 1.0 / 145.0;
const CX = 294.0;
const CY = 251.0;

const pxToX = (px: number) => (px - CX) * SCALE;
const pyToY = (py: number) => (CY - py) * SCALE;

// 4th-degree polynomial fitted to the exact lip parting seam of the first image (px in [256..338])
function seamPy(px: number): number {
  const dx = clamp(px, 256.0, 338.0) - 297.0;
  return (
    311.93 -
    0.0081 * dx * dx -
    0.000018 * dx * dx -
    0.0000006 * dx * dx * dx * dx
  );
}

// Sculpted 3D cranial, brow, nose, cheek, lip, chin, and hair depth relief Z(px, py)
function reliefZ(px: number, py: number): number {
  const fx = (px - 295.0) / 115.0;
  const fy = (py - 238.0) / 142.0;
  const r2 = fx * fx + fy * fy;
  const faceDome =
    r2 < 1.35 ? 0.48 * Math.sqrt(Math.max(0.0, 1.0 - r2 * 0.74)) : 0.0;

  const hx = (px - 295.0) / 165.0;
  const hy = (py - 205.0) / 195.0;
  const hr2 = hx * hx + hy * hy;
  const hairVol =
    hr2 < 1.2 ? 0.28 * Math.sqrt(Math.max(0.0, 1.0 - hr2 * 0.82)) : 0.0;

  const nx = (px - 295.0) / 21.0;
  const nyTip = (py - 273.0) / 17.0;
  const nyBridge = (py - 242.0) / 34.0;
  const noseTip = 0.13 * Math.exp(-(nx * nx + nyTip * nyTip));
  const noseBridge = 0.065 * Math.exp(-(nx * nx * 1.8 + nyBridge * nyBridge));

  const cLx = (px - 226.0) / 42.0;
  const cLy = (py - 262.0) / 38.0;
  const cRx = (px - 364.0) / 42.0;
  const cRy = (py - 262.0) / 38.0;
  const cheeks =
    0.055 *
    (Math.exp(-(cLx * cLx + cLy * cLy)) + Math.exp(-(cRx * cRx + cRy * cRy)));

  const eLx = (px - 234.0) / 28.0;
  const eLy = (py - 211.0) / 22.0;
  const eRx = (px - 353.0) / 28.0;
  const eRy = (py - 210.0) / 22.0;
  const eyes =
    0.04 *
    (Math.exp(-(eLx * eLx + eLy * eLy)) + Math.exp(-(eRx * eRx + eRy * eRy)));

  const mx = (px - 297.0) / 42.0;
  const my = (py - 313.0) / 18.0;
  const lipCushion = 0.065 * Math.exp(-(mx * mx + my * my));
  const chx = (px - 296.0) / 36.0;
  const chy = (py - 356.0) / 24.0;
  const chinBoss = 0.045 * Math.exp(-(chx * chx + chy * chy));

  const neckWeight = smooth(368.0, 395.0, py);
  const torsoZ = 0.22 * (1.0 - 0.35 * Math.pow((px - 295.0) / 180.0, 2));
  const headZ =
    Math.max(faceDome, hairVol) +
    noseTip +
    noseBridge +
    cheeks +
    eyes +
    lipCushion +
    chinBoss;
  return headZ * (1.0 - neckWeight * 0.45) + torsoZ * neckWeight * 0.45;
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════ */
function ThreeSpeechFaceInner(props: ThreeSpeechFaceProps) {
  const isStandaloneDemo =
    props.word === undefined && props.isSpeaking === undefined;

  const [demoWord, setDemoWord] = useState("नमस्ते");
  const [demoSpeaking, setDemoSpeaking] = useState(true);
  const [demoSpeed, setDemoSpeed] = useState(0.75);
  const [demoLang, setDemoLang] = useState<"hi" | "en">("hi");
  const [manualPose, setManualPose] = useState<Pose | null>(null);
  const [manualLabel, setManualLabel] = useState<string>("");

  const activeWord = isStandaloneDemo ? demoWord : props.word || "";
  const activeSpeaking = isStandaloneDemo
    ? demoSpeaking
    : Boolean(props.isSpeaking);
  const activeSpeed = isStandaloneDemo ? demoSpeed : (props.speed ?? 0.75);
  const detectedLang: "hi" | "en" =
    props.lang ||
    (isStandaloneDemo ? demoLang : /[ऀ-ॿ]/.test(activeWord) ? "hi" : "en");
  const className = props.className || "";

  const mountRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLSpanElement | null>(null);

  const isSpeakingRef = useRef(activeSpeaking);
  const wordRef = useRef(activeWord);
  const speedRef = useRef(activeSpeed);
  const langRef = useRef(detectedLang);
  const manualPoseRef = useRef<Pose | null>(manualPose);
  const manualLabelRef = useRef<string>(manualLabel);

  useEffect(() => {
    isSpeakingRef.current = activeSpeaking;
    wordRef.current = activeWord;
    speedRef.current = activeSpeed;
    langRef.current = detectedLang;
    manualPoseRef.current = manualPose;
    manualLabelRef.current = manualLabel;
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    /* ── 1. Renderer / Scene / Camera ─────────────────────────── */
    const scene = new THREE.Scene();
    const FOV = 26;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ("SRGBColorSpace" in THREE) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    container.appendChild(renderer.domElement);

    const fit = () => {
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      const th = 2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
      const distH = 3.46 / th;
      const distW = 3.15 / (th * camera.aspect);
      camera.position.set(0, 0.0, Math.max(distH, distW));
      camera.lookAt(0, 0.0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    fit();

    /* ── 2. Build Curvilinear Split-Lip 3D Relief Mesh ─────────── */
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const xCols: number[] = [];
    for (let px = 70; px < 215; px += 5.5) xCols.push(px);
    for (let px = 215; px <= 378; px += 1.75) xCols.push(px);
    for (let px = 382; px <= 516; px += 5.5) xCols.push(px);
    const COLS = xCols.length;
    const NX = COLS - 1;

    const S_SEAM = 0.62;
    const topRows = 54;
    const botRows = 42;
    const sVals: number[] = [];
    for (let i = 0; i <= topRows; i++) {
      const u = i / topRows;
      sVals.push(u < 0.7 ? u * (0.54 / 0.7) : 0.54 + (u - 0.7) * (0.08 / 0.3));
    }
    for (let j = 0; j <= botRows; j++) {
      const v = j / botRows;
      sVals.push(
        S_SEAM +
          (v < 0.35 ? v * (0.08 / 0.35) : 0.08 + (v - 0.35) * (0.3 / 0.65)),
      );
    }
    const R_SEAM_TOP = topRows;
    const R_SEAM_BOT = topRows + 1;
    const TOTAL_ROWS = sVals.length;

    const restPy = (px: number, s: number) => {
      const pyS = seamPy(px);
      return s <= S_SEAM
        ? (s / S_SEAM) * pyS
        : pyS + ((s - S_SEAM) / (1.0 - S_SEAM)) * (IMG_H - pyS);
    };

    const vertCount = TOTAL_ROWS * COLS;
    const posArr = new Float32Array(vertCount * 3);
    const uvArr = new Float32Array(vertCount * 2);
    const basePx = new Float32Array(vertCount);
    const basePy = new Float32Array(vertCount);
    const baseZ = new Float32Array(vertCount);
    const baseUvX = new Float32Array(vertCount);
    const baseUvY = new Float32Array(vertCount);

    for (let r = 0; r < TOTAL_ROWS; r++) {
      const s = sVals[r];
      const isUpper = r <= R_SEAM_TOP;
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        const px = xCols[c];
        const py = restPy(px, s);
        basePx[idx] = px;
        basePy[idx] = py;
        baseZ[idx] = reliefZ(px, py);

        // Sub-pixel vermilion UV offset along lip parting seam
        const mouthMask = Math.exp(-Math.pow((px - 297.0) / 37.0, 4));
        let upy = py;
        if (isUpper) {
          const distS = (S_SEAM - s) / 0.035;
          if (distS >= 0 && distS < 1) upy -= 0.9 * (1.0 - distS) * mouthMask;
        } else {
          const distS = (s - S_SEAM) / 0.035;
          if (distS >= 0 && distS < 1) upy += 1.0 * (1.0 - distS) * mouthMask;
        }

        const u0 = clamp(px / IMG_W, 0, 1);
        const v0 = clamp(1.0 - upy / IMG_H, 0, 1);
        baseUvX[idx] = u0;
        baseUvY[idx] = v0;
        uvArr[idx * 2] = u0;
        uvArr[idx * 2 + 1] = v0;

        posArr[idx * 3] = pxToX(px);
        posArr[idx * 3 + 1] = pyToY(py);
        posArr[idx * 3 + 2] = baseZ[idx];
      }
    }

    const faceIndices: number[] = [];
    for (let r = 0; r < TOTAL_ROWS - 1; r++) {
      // Topological mouth split: R_SEAM_TOP and R_SEAM_BOT are unconnected so the lips part cleanly
      if (r === R_SEAM_TOP) continue;
      for (let c = 0; c < NX; c++) {
        const a = r * COLS + c;
        const b = a + 1;
        const d = a + COLS;
        const e = d + 1;
        faceIndices.push(a, d, b, b, d, e);
      }
    }

    const faceGeo = new THREE.BufferGeometry();
    faceGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    faceGeo.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2));
    faceGeo.setIndex(faceIndices);

    const avatarTex = new THREE.TextureLoader().load(AVATAR_DATA_URI);
    if ("SRGBColorSpace" in THREE) {
      avatarTex.colorSpace = THREE.SRGBColorSpace;
    }
    avatarTex.minFilter = THREE.LinearFilter;
    avatarTex.magFilter = THREE.LinearFilter;
    avatarTex.generateMipmaps = false;

    const faceMat = new THREE.MeshBasicMaterial({
      map: avatarTex,
      transparent: true,
      alphaTest: 0.015,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.renderOrder = 10;
    faceMesh.frustumCulled = false;
    rootGroup.add(faceMesh);

    /* ── 3. 3D Oral Cavity, Dental Arch, and Articulated Tongue ── */
    const mCols: number[] = [];
    for (let c = 0; c < COLS; c++) {
      if (xCols[c] >= 252 && xCols[c] <= 342) mCols.push(c);
    }
    const MCOLS = mCols.length;
    const MN = MCOLS - 1;

    interface MouthStrip {
      mesh: THREE.Mesh;
      geo: THREE.BufferGeometry;
      pos: Float32Array;
      col: Float32Array;
      rows: number;
    }

    const makeMouthStrip = (rows: number, order: number): MouthStrip => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(MCOLS * rows * 3);
      const col = new Float32Array(MCOLS * rows * 3);
      const idx: number[] = [];
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < MN; c++) {
          const a = r * MCOLS + c;
          const b = a + 1;
          const d = a + MCOLS;
          const e = d + 1;
          idx.push(a, d, b, b, d, e);
        }
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setIndex(idx);
      const mat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = order;
      mesh.frustumCulled = false;
      rootGroup.add(mesh);
      return { mesh, geo, pos, col, rows };
    };

    const cavityS = makeMouthStrip(4, 2);
    const tongueBaseS = makeMouthStrip(5, 4);
    const upperTeethS = makeMouthStrip(4, 6);
    const upperTeethShadowS = makeMouthStrip(3, 7);

    /* ── 4. 3D Blinking Eyelid Strips (Left & Right Eyes) ─────── */
    const EC_N = 28;
    const EC_COLS = EC_N + 1;
    const makeEyelidStrip = (): MouthStrip => {
      const rows = 5;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(EC_COLS * rows * 3);
      const col = new Float32Array(EC_COLS * rows * 3);
      const idx: number[] = [];
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < EC_N; c++) {
          const a = r * EC_COLS + c;
          const b = a + 1;
          const d = a + EC_COLS;
          const e = d + 1;
          idx.push(a, d, b, b, d, e);
        }
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setIndex(idx);
      const mat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = 15;
      mesh.frustumCulled = false;
      mesh.visible = false;
      rootGroup.add(mesh);
      return { mesh, geo, pos, col, rows };
    };

    const lidLeftS = makeEyelidStrip();
    const lidRightS = makeEyelidStrip();

    const hasModernColorSpace = "SRGBColorSpace" in THREE;
    const toVertColor = (c: number) => {
      const v = clamp(c, 0, 1);
      if (!hasModernColorSpace) return v;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };

    const setStripVert = (
      s: MouthStrip,
      colsCount: number,
      r: number,
      i: number,
      x: number,
      y: number,
      z: number,
      cr: number,
      cg: number,
      cb: number,
    ) => {
      const o = (r * colsCount + i) * 3;
      s.pos[o] = x;
      s.pos[o + 1] = y;
      s.pos[o + 2] = z;
      s.col[o] = toVertColor(cr);
      s.col[o + 1] = toVertColor(cg);
      s.col[o + 2] = toVertColor(cb);
    };

    const finishStrip = (s: MouthStrip) => {
      (s.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (s.geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    };

    const colTopPy = new Float32Array(COLS);
    const colBotPy = new Float32Array(COLS);
    const colArch = new Float32Array(COLS);

    const rotPoint = (
      X: number,
      Y: number,
      Z: number,
      py0: number,
      yaw: number,
      pitch: number,
      roll: number,
    ): [number, number, number] => {
      // Smoothly anchor shoulders & lower collar while head/hair rotates in 3D
      const rotW = 1.0 - smooth(385.0, 445.0, py0);
      const ry = yaw * rotW;
      const rx = pitch * rotW;
      const rz = roll * rotW;
      const pY = -0.35;
      const pZ = 0.15;
      const Yc = Y - pY;
      const Zc = Z - pZ;
      // Pitch around X
      const Y1 = Yc * Math.cos(rx) - Zc * Math.sin(rx);
      const Z1 = Yc * Math.sin(rx) + Zc * Math.cos(rx);
      // Yaw around Y
      const X2 = X * Math.cos(ry) + Z1 * npSin(ry);
      const Z2 = -X * npSin(ry) + Z1 * Math.cos(ry);
      // Roll around Z
      const X3 = X2 * Math.cos(rz) - Y1 * Math.sin(rz);
      const Y3 = X2 * Math.sin(rz) + Y1 * Math.cos(rz);
      return [X3, Y3 + pY, Z2 + pZ];
    };
    function npSin(v: number) {
      return Math.sin(v);
    }

    const updateCharacter = (
      p: Pose,
      yaw: number,
      pitch: number,
      roll: number,
      gazeX: number,
      gazeY: number,
      blink: number,
      browWave: number,
    ) => {
      const pk = clamp(p.pucker, 0, 1);
      const closeK = clamp(p.close, 0, 1);
      const openF = 1.0 - closeK;
      const jaw = Math.max(0, p.jaw);
      const jawPx = jaw * 56.0;

      // Rest pose keeps the exact 1.55px natural smile parting line of the first image
      const restGapPx = 1.55 * openF * (1.0 - 0.65 * pk);
      const hUPx =
        (Math.max(0, p.upper) * 68.0 + jawPx * 0.16) * openF +
        1.8 * p.tuck +
        restGapPx * 0.44;
      const hLPx = jawPx * 0.84 * openF - 2.2 * p.tuck + restGapPx * 0.56;

      const effHalfSpan = 38.5 * (1.0 - 0.28 * pk);
      const expo = 0.58 + 0.35 * pk;
      const smileDelta = (p.smile - 0.55) * (1.0 - 0.65 * pk);

      for (let c = 0; c < COLS; c++) {
        const px0 = xCols[c];
        const pyS = seamPy(px0);
        const dx = px0 - 297.0;
        const t = dx / effHalfSpan;
        const arch =
          Math.abs(t) < 1.0 ? Math.pow(Math.max(0, 1.0 - t * t), expo) : 0.0;
        colArch[c] = arch;

        const cf = clamp(Math.abs(dx) / 39.0, 0, 1.2);
        const cornerLiftPx =
          -smileDelta * 4.5 * cf * cf * Math.exp(-Math.pow(dx / 54.0, 2));
        const pressPx = closeK * 0.5 * Math.exp(-Math.pow(dx / 35.0, 2));
        let tp = pyS - hUPx * arch + cornerLiftPx + pressPx;
        let bt = pyS + hLPx * arch + cornerLiftPx - pressPx;
        if (bt < tp) {
          tp = bt = 0.5 * (tp + bt);
        }
        colTopPy[c] = tp;
        colBotPy[c] = bt;
      }

      // 1. Deform 3D Face Mesh & Update Iris Gaze UVs
      for (let r = 0; r < TOTAL_ROWS; r++) {
        const isUpper = r <= R_SEAM_TOP;
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          const px0 = basePx[idx];
          const py0 = basePy[idx];
          const z0 = baseZ[idx];
          const pyS = seamPy(px0);
          const dx = px0 - 297.0;
          const dyM = py0 - pyS;

          const wMouthX = Math.exp(
            -Math.pow(dx / 54.0, 2) - Math.pow(dyM / 32.0, 2),
          );
          const px = 297.0 + dx * (1.0 + (p.width - 1.0) * 0.58 * wMouthX);
          let py = py0;
          let dz = 0.0;

          if (isUpper) {
            const distUp = Math.max(0, pyS - py0);
            const lipUpDecay = Math.exp(-Math.pow(distUp / 16.0, 2));
            py = py0 + (colTopPy[c] - pyS) * lipUpDecay;

            // Natural cheek lift on smile
            const cheekSmile =
              Math.max(0, p.smile - 0.4) *
              3.2 *
              Math.exp(
                -Math.pow((Math.abs(dx) - 48.0) / 28.0, 2) -
                  Math.pow((py0 - 275.0) / 28.0, 2),
              );
            py -= cheekSmile;

            // Expressive eyebrow arch during speech
            const browMask = Math.exp(
              -Math.pow((Math.abs(dx) - 56.0) / 36.0, 2) -
                Math.pow((py0 - 165.0) / 20.0, 2),
            );
            py -= (jaw * 8.0 + browWave * 3.5) * browMask;

            dz +=
              pk * 0.065 * colArch[c] * Math.exp(-Math.pow(distUp / 14.0, 2));
          } else {
            const distDn = Math.max(0, py0 - pyS);
            const lipDnDecay = Math.exp(-Math.pow(distDn / 42.0, 1.65));
            const chinFollow =
              jawPx *
              0.22 *
              Math.exp(
                -Math.pow(dx / 38.0, 2) - Math.pow((py0 - 352.0) / 26.0, 2),
              ) *
              (1.0 - lipDnDecay);
            py = py0 + (colBotPy[c] - pyS) * lipDnDecay + chinFollow;
            dz +=
              (pk * 0.072 - p.tuck * 0.04) *
              colArch[c] *
              Math.exp(-Math.pow(distDn / 16.0, 2));
          }

          const [rx, ry, rz] = rotPoint(
            pxToX(px),
            pyToY(py),
            z0 + dz,
            py0,
            yaw,
            pitch,
            roll,
          );
          posArr[idx * 3] = rx;
          posArr[idx * 3 + 1] = ry;
          posArr[idx * 3 + 2] = rz;

          // Smooth iris gaze shift inside left eye (233, 211) & right eye (353.5, 210)
          let u = baseUvX[idx];
          let v = baseUvY[idx];
          if (py0 >= 190 && py0 <= 234) {
            for (const [ecx, top0, bot0] of [
              [233.0, 196.5, 232.0],
              [353.5, 195.5, 231.0],
            ]) {
              const edx = px0 - ecx;
              const et = edx / 29.5;
              if (Math.abs(et) < 1.0) {
                const pyTop = top0 + 21.5 * et * et;
                const pyBot = bot0 - 9.5 * et * et;
                if (py0 >= pyTop && py0 <= pyBot) {
                  const uOpen = (py0 - pyTop) / Math.max(1.0, pyBot - pyTop);
                  const eyeMask =
                    Math.sin(clamp(uOpen, 0, 1) * Math.PI) *
                    Math.max(0, 1.0 - Math.pow(edx / 24.0, 2));
                  u = clamp(u - (gazeX * 5.8 * eyeMask) / IMG_W, 0, 1);
                  v = clamp(v - (gazeY * 3.4 * eyeMask) / IMG_H, 0, 1);
                }
              }
            }
          }
          uvArr[idx * 2] = u;
          uvArr[idx * 2 + 1] = v;
        }
      }
      (faceGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (faceGeo.attributes.uv as THREE.BufferAttribute).needsUpdate = true;

      // 2. Update 3D Blinking Eyelids
      const showBlink = blink > 0.015;
      lidLeftS.mesh.visible = showBlink;
      lidRightS.mesh.visible = showBlink;
      if (showBlink) {
        const updateEyeLid = (
          strip: MouthStrip,
          ecx: number,
          top0: number,
          bot0: number,
        ) => {
          for (let i = 0; i < EC_COLS; i++) {
            const t = -1.0 + (2.0 * i) / EC_N;
            const px = ecx + t * 29.8;
            const pyTop = top0 - 5.0 + 25.5 * t * t;
            const pyBot = bot0 - 9.5 * t * t;
            const pyLid = pyTop + blink * (pyBot - pyTop + 1.2);
            for (let r = 0; r < 5; r++) {
              const u = r / 4;
              const py = pyTop + (pyLid - pyTop) * u;
              const z0 = reliefZ(px, py) + 0.015;
              const [wx, wy, wz] = rotPoint(
                pxToX(px),
                pyToY(py),
                z0,
                py,
                yaw,
                pitch,
                roll,
              );
              const isLash = r >= 3;
              const sphereHi =
                0.05 * Math.max(0, 1.0 - t * t) * Math.sin(u * Math.PI);
              const cr = isLash
                ? 0.16
                : 0.88 - 0.12 * u - 0.06 * t * t + sphereHi;
              const cg = isLash
                ? 0.09
                : 0.68 - 0.11 * u - 0.05 * t * t + sphereHi;
              const cb = isLash
                ? 0.07
                : 0.58 - 0.09 * u - 0.04 * t * t + sphereHi;
              setStripVert(strip, EC_COLS, r, i, wx, wy, wz, cr, cg, cb);
            }
          }
          finishStrip(strip);
        };
        updateEyeLid(lidLeftS, 233.0, 196.5, 232.0);
        updateEyeLid(lidRightS, 353.5, 195.5, 231.0);
      }

      // 3. Update 3D Oral Cavity, Dental Arch, and Tongue
      let maxGapPx = 0;
      for (let i = 0; i < MCOLS; i++) {
        const c = mCols[i];
        maxGapPx = Math.max(maxGapPx, colBotPy[c] - colTopPy[c]);
      }

      const showInterior = maxGapPx > 0.25;
      cavityS.mesh.visible = showInterior;
      tongueBaseS.mesh.visible = showInterior && maxGapPx > 2.2;
      upperTeethS.mesh.visible = showInterior && maxGapPx > 2.0;
      upperTeethShadowS.mesh.visible = showInterior && maxGapPx > 2.0;
      if (!showInterior) return;

      const TUCK_W = 0.024;
      const midIdx = Math.floor(MCOLS / 2);
      const cMid = mCols[midIdx];
      const yTMidWorld = posArr[(R_SEAM_TOP * COLS + cMid) * 3 + 1];
      const yBMidWorld = posArr[(R_SEAM_BOT * COLS + cMid) * 3 + 1];
      const availMidWorld = Math.max(0, yTMidWorld - yBMidWorld);
      const toothShowWorld =
        Math.min(availMidWorld * 0.4, 0.032) * smooth(2.0, 4.5, maxGapPx);

      for (let i = 0; i < MCOLS; i++) {
        const c = mCols[i];
        const idxT = (R_SEAM_TOP * COLS + c) * 3;
        const idxB = (R_SEAM_BOT * COLS + c) * 3;
        const x = posArr[idxT];
        const yT = posArr[idxT + 1];
        const zT = posArr[idxT + 2];
        const yB = posArr[idxB + 1];
        const zB = posArr[idxB + 2];
        const zM = 0.5 * (zT + zB);
        const avail = Math.max(0, yT - yB);
        const t = (xCols[c] - 297.0) / 39.0;

        // A. Deep Warm Oral Cavity (tucked underneath upper & lower lips)
        for (let r = 0; r < 4; r++) {
          const u = r / 3;
          const y = yT + TUCK_W + (yB - TUCK_W - (yT + TUCK_W)) * u;
          const centerGlow = Math.max(0, 1.0 - t * t) * Math.sin(u * Math.PI);
          setStripVert(
            cavityS,
            MCOLS,
            r,
            i,
            x,
            y,
            zM - 0.05,
            0.19 + 0.08 * centerGlow,
            0.045 + 0.025 * centerGlow,
            0.065 + 0.03 * centerGlow,
          );
        }

        // B. 3D Sculpted Tongue (height tY, forward reach tZ, retroflex curl)
        const h01 = clamp((p.tY + 0.25) / 1.25, 0, 1);
        const reach01 = clamp((p.tZ + 0.5) / 1.5, 0, 1);
        const tWidth = 0.54 + 0.22 * reach01;
        const lat = Math.max(0, 1.0 - Math.pow(t / tWidth, 2));
        const dome = Math.pow(lat, 0.72);
        const ratio = clamp(0.24 + 0.58 * h01 + 0.1 * p.curl, 0, 0.82);
        const tTopY =
          yB + Math.min(avail * ratio * dome, Math.max(0, avail - 0.012));
        const curlDark = 1.0 - 0.14 * p.curl;

        for (let r = 0; r < 5; r++) {
          const u = r / 4;
          const y = tTopY * (1.0 - u) + (yB - TUCK_W * 0.7) * u;
          const hi =
            (0.75 + 0.25 * (1.0 - u * 0.6)) * (0.78 + 0.22 * lat) * curlDark;
          setStripVert(
            tongueBaseS,
            MCOLS,
            r,
            i,
            x,
            y,
            zM - 0.038,
            0.88 * hi,
            0.42 * hi,
            0.48 * hi,
          );
        }

        // C. Natural Horizontal Upper Dental Arch (with dark buccal corridors at corners)
        const archMask = smooth(0.66, 0.42, Math.abs(t));
        const yBite = yTMidWorld - toothShowWorld * (1.0 - 0.18 * t * t);
        const toothDrop =
          Math.max(0, Math.min(yT - yBite, avail * 0.72)) * archMask;
        const yEdge = yT - toothDrop;
        const groove = 0.94 + 0.06 * Math.cos(t * Math.PI * 5.5);
        const sideAO = 0.75 + 0.25 * Math.max(0, 1.0 - t * t);

        for (let r = 0; r < 4; r++) {
          const u = r / 3;
          const y = (yT + TUCK_W * 0.6) * (1.0 - u) + yEdge * u;
          const lum = sideAO * groove * (0.86 + 0.14 * u);
          setStripVert(
            upperTeethS,
            MCOLS,
            r,
            i,
            x,
            y,
            zM - 0.025,
            0.97 * lum,
            0.93 * lum,
            0.9 * lum,
          );
        }

        // D. Soft Upper-Lip Ambient Occlusion Shadow along top of teeth
        const shaDrop = Math.min(0.008, toothDrop * 0.42);
        for (let r = 0; r < 3; r++) {
          const u = r / 2;
          const y = (yT + TUCK_W * 0.6) * (1.0 - u) + (yT - shaDrop) * u;
          setStripVert(
            upperTeethShadowS,
            MCOLS,
            r,
            i,
            x,
            y,
            zM - 0.02,
            0.72,
            0.52,
            0.53,
          );
        }
      }

      finishStrip(cavityS);
      finishStrip(tongueBaseS);
      finishStrip(upperTeethS);
      finishStrip(upperTeethShadowS);
    };

    /* ── 5. Pointer Interaction ───────────────────────────────── */
    const look = { x: 0, y: 0 };
    const setLook = (cx: number, cy: number) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      look.x = clamp(((cx - rect.left) / rect.width) * 2 - 1, -1, 1);
      look.y = clamp(-(((cy - rect.top) / rect.height) * 2 - 1), -1, 1);
    };
    const onMouseMove = (e: MouseEvent) => setLook(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) setLook(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => {
      look.x = 0;
      look.y = 0;
    };
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onLeave);

    /* ── 6. Animation & High-Precision Lip-Sync Loop ──────────── */
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    let cachedWord = wordRef.current;
    let timeline = buildTimeline(cachedWord);
    let tUnits = 0;
    let wasSpeaking = false;
    const cur: Pose = { ...REST_POSE };
    let curYaw = 0;
    let curPitch = 0;
    let curRoll = 0;
    let curGazeX = 0;
    let curGazeY = 0;
    let lastHud = "";

    let blinkTimer = 0;
    let blinking = false;
    let nextBlink = 2.8;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.elapsedTime;

      if (wordRef.current !== cachedWord) {
        cachedWord = wordRef.current;
        timeline = buildTimeline(cachedWord);
        tUnits = 0;
      }

      const speaking = isSpeakingRef.current;
      if (speaking && !wasSpeaking) {
        tUnits = 0;
        timeline = buildTimeline(wordRef.current);
      }
      wasSpeaking = speaking;

      // Smooth 3D head turn + faster eye gaze tracking
      const talkNod = speaking ? Math.sin(elapsed * 5.2) * 0.018 : 0;
      const talkTilt = speaking ? Math.sin(elapsed * 2.4) * 0.014 : 0;
      curYaw = THREE.MathUtils.lerp(curYaw, look.x * 0.22, 0.08);
      curPitch = THREE.MathUtils.lerp(curPitch, -look.y * 0.14 + talkNod, 0.08);
      curRoll = THREE.MathUtils.lerp(curRoll, talkTilt, 0.08);
      curGazeX = THREE.MathUtils.lerp(curGazeX, look.x * 0.85, 0.14);
      curGazeY = THREE.MathUtils.lerp(curGazeY, -look.y * 0.75, 0.14);

      // Gentle breathing motion
      rootGroup.position.y = Math.sin(elapsed * 1.9) * 0.016;

      // Natural blinking
      blinkTimer += dt;
      if (!blinking && blinkTimer >= nextBlink) {
        blinking = true;
        blinkTimer = 0;
      }
      let blinkAmt = 0;
      if (blinking) {
        const ph = blinkTimer / 0.15;
        if (ph >= 1) {
          blinking = false;
          blinkTimer = 0;
          nextBlink = 2.5 + Math.random() * 2.6;
        } else {
          blinkAmt = Math.sin(ph * Math.PI);
        }
      }

      // Speech target pose
      let target: Pose = REST_POSE;
      let hud = "";
      if (manualPoseRef.current) {
        target = manualPoseRef.current;
        hud = manualLabelRef.current;
      } else if (speaking) {
        // Natural speech pacing (~230ms per articulation frame / speed)
        const unitSec = 0.22 / Math.max(0.2, speedRef.current || 0.75);
        tUnits += dt / unitSec;
        if (tUnits >= timeline.total) {
          // Utterance articulation completed! Rest naturally, do not loop mouth movements
          target = REST_POSE;
          hud =
            langRef.current === "hi"
              ? "आराम स्थिति • तैयार"
              : "Natural Rest • Ready";
        } else {
          const s = sampleTimeline(timeline, tUnits);
          target = s.pose;
          const k = s.key;
          const sym = k.symbol ? `${k.symbol} · ` : "";
          hud =
            langRef.current === "hi"
              ? `${sym}${k.labelHi} (${k.name})`
              : `${sym}${k.name} (${k.labelHi})`;
        }
      } else {
        hud =
          langRef.current === "hi"
            ? "आराम स्थिति • तैयार"
            : "Natural Rest • Ready";
      }

      // Crisp exponential articulation smoothing (fast bilabial closure & tongue response)
      for (const key of POSE_KEYS) {
        const rate =
          !speaking && !manualPoseRef.current
            ? 14
            : key === "close" || key === "tuck"
              ? 85
              : key === "tY" || key === "tZ" || key === "curl"
                ? 52
                : 42;
        cur[key] += (target[key] - cur[key]) * (1 - Math.exp(-rate * dt));
      }

      if (hudRef.current && hud !== lastHud) {
        hudRef.current.textContent = hud;
        lastHud = hud;
      }

      const browWave = speaking ? Math.sin(elapsed * 4.6) * 0.35 : 0;
      updateCharacter(
        cur,
        curYaw,
        curPitch,
        curRoll,
        curGazeX,
        curGazeY,
        blinkAmt,
        browWave,
      );

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", fit);

    /* ── 7. Cleanup ───────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", fit);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onLeave);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      avatarTex.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const speakWithTTS = (textToSpeak: string) => {
    setManualPose(null);
    setDemoWord(textToSpeak);
    speakHindi(textToSpeak, demoSpeed, {
      onStart: () => setDemoSpeaking(true),
      onEnd: () => setDemoSpeaking(false),
    })
      .catch(() => {})
      .finally(() => {
        setDemoSpeaking(false);
      });
  };

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="relative w-full h-72 sm:h-80 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        title="3D Speech Coach - Moves lips and jaw in sync with speech"
      />

      {/* Articulation HUD Pill */}
      <div className="mt-1 flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-stone-200/80 shadow-2xs text-[11px] font-semibold text-zinc-600 select-none">
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            activeSpeaking || manualPose
              ? "bg-amber-600 animate-pulse"
              : "bg-stone-300"
          }`}
        />
        <span
          ref={hudRef}
          className={
            activeSpeaking || manualPose
              ? "text-amber-700 font-bold"
              : "text-zinc-400"
          }
        >
          {detectedLang === "hi"
            ? "आराम स्थिति • तैयार"
            : "Natural Rest • Ready"}
        </span>
      </div>

      {/* Interactive Demo Controls (Rendered automatically when previewed standalone in Canvas) */}
      {isStandaloneDemo && (
        <div className="mt-3 w-full max-w-md rounded-2xl bg-stone-50/90 border border-stone-200/90 p-3 shadow-xs flex flex-col gap-2.5 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={demoWord}
              onChange={(e) => {
                setManualPose(null);
                setDemoWord(e.target.value);
              }}
              placeholder="Type Hindi or English word..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            <button
              type="button"
              onClick={() => {
                setManualPose(null);
                if (!demoSpeaking) {
                  speakWithTTS(demoWord);
                } else {
                  stopSpeaking();
                  setDemoSpeaking(false);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                demoSpeaking && !manualPose
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-stone-800 text-white hover:bg-stone-900"
              }`}
            >
              {demoSpeaking && !manualPose ? "Pause" : "Speak"}
            </button>
            <button
              type="button"
              onClick={() => setDemoLang((l) => (l === "hi" ? "en" : "hi"))}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              {demoLang === "hi" ? "HI" : "EN"}
            </button>
          </div>

          {/* Preset Words */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-stone-400 mr-1">
              Words:
            </span>
            {[
              "नमस्ते",
              "कमल",
              "प्रणाम",
              "पाठशाला",
              "सुप्रभात",
              "Namaste",
              "Hello World",
            ].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => speakWithTTS(w)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  demoWord === w && !manualPose
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Viseme Inspector & Speed Control */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/80">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-semibold text-stone-400 mr-0.5">
                Visemes:
              </span>
              {[
                {
                  label: "Rest",
                  pose: REST_POSE,
                  hud: "Natural Rest • आराम स्थिति",
                },
                {
                  label: "आ (AA)",
                  pose: VOWELS.aa.pose,
                  hud: "आ · Open A (खुला मुख)",
                },
                {
                  label: "ई (II)",
                  pose: VOWELS.ii.pose,
                  hud: "ई · Long I (मुस्कान)",
                },
                {
                  label: "ऊ (UU)",
                  pose: VOWELS.uu.pose,
                  hud: "ऊ · Long U (गोल होंठ)",
                },
                {
                  label: "ओ (O)",
                  pose: VOWELS.o.pose,
                  hud: "ओ · Rounded O (गोल होंठ)",
                },
                {
                  label: "त (Dental)",
                  pose: composeConsonant("dental", VOWELS.a.pose),
                  hud: "त · Dental (जीभ दांतों पर)",
                },
                {
                  label: "प/म (Closed)",
                  pose: composeConsonant("bilabial", VOWELS.a.pose),
                  hud: "प/म · Bilabial (होंठ बंद)",
                },
                {
                  label: "व/फ़ (Tuck)",
                  pose: composeConsonant("labiodental", VOWELS.a.pose),
                  hud: "व · Labiodental (दांत-होंठ)",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.label === "Rest") {
                      setManualPose(null);
                      setDemoSpeaking(false);
                    } else {
                      setDemoSpeaking(false);
                      setManualPose(item.pose);
                      setManualLabel(item.hud);
                    }
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold transition-colors cursor-pointer ${
                    manualLabel === item.hud && manualPose
                      ? "bg-amber-600 text-white"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-stone-400">
                Speed:
              </span>
              {[0.5, 0.75, 1.0].map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setDemoSpeed(sp)}
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold cursor-pointer ${
                    demoSpeed === sp
                      ? "bg-stone-800 text-white"
                      : "bg-white text-stone-600 border border-stone-200"
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MemoizedThreeSpeechFace = memo(ThreeSpeechFaceInner);

export default function ThreeSpeechFace(props: ThreeSpeechFaceProps) {
  return <MemoizedThreeSpeechFace {...props} />;
}
