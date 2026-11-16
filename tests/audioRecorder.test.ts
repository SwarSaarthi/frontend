import { afterEach, expect, it, vi } from "vitest";
import { AudioRecorder } from "@/lib/audioRecorder";

afterEach(() => vi.unstubAllGlobals());

it("releases a microphone granted after the recorder was disposed", async () => {
  let grant!: (stream: MediaStream) => void;
  const stop = vi.fn();
  const onDataAvailable = vi.fn();
  const MediaRecorderMock = vi.fn();
  vi.stubGlobal("MediaRecorder", MediaRecorderMock);
  vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: () => new Promise((resolve) => { grant = resolve; }) } });
  const recorder = new AudioRecorder({ onDataAvailable });
  const pending = recorder.startRecording();
  recorder.destroy();
  grant({ getTracks: () => [{ stop }] } as unknown as MediaStream);
  await pending;
  expect(stop).toHaveBeenCalledOnce();
  expect(MediaRecorderMock).not.toHaveBeenCalled();
  expect(onDataAvailable).not.toHaveBeenCalled();
});
