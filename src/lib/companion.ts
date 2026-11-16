/** Signals actual playback and recording state without requesting microphone access. */
export function notifyCompanion(kind: "speaking" | "listening", active: boolean) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("mitra-activity", { detail: { kind, active } }));
}
export function companionAudio(): HTMLAudioElement {
  const audio = new Audio();
  audio.addEventListener("playing", () => notifyCompanion("speaking", true));
  for (const event of ["ended", "pause", "error", "emptied", "waiting"]) audio.addEventListener(event, () => notifyCompanion("speaking", false));
  return audio;
}
