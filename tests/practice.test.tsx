import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import PracticePage from "@/app/practice/page";
import { asrApi, getAuthToken, practiceApi, wordsApi, type AsrPredictResult, type WordItem } from "@/lib/api";
import type { FeedbackState, Word } from "@/types";

const navigation = vi.hoisted(() => ({ query: "", router: { replace: vi.fn() } }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(navigation.query),
  useRouter: () => navigation.router,
}));
vi.mock("@/components/AuthGuard", () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock("next/dynamic", () => ({
  default: () => function TestRecorder(props: {
    disabled: boolean;
    onRecordingComplete: (blob: Blob) => void;
    onRecordingStateChange?: (recording: boolean) => void;
  }) {
    return <>
      <button disabled={props.disabled} onClick={() => props.onRecordingStateChange?.(true)}>Start recording</button>
      <button disabled={props.disabled} onClick={() => {
        props.onRecordingComplete(new Blob(["recording"]));
        props.onRecordingStateChange?.(false);
      }}>Submit recording</button>
    </>;
  },
}));
vi.mock("@/components/SpeechAvatar", () => ({ default: () => null }));
vi.mock("@/components/MitraPipelineProgress", () => ({ default: () => <p>Evaluating recording</p> }));
vi.mock("@/components/WordCard", () => ({ default: ({ word }: { word: Word }) => <p data-testid="target">{word.word}</p> }));
vi.mock("@/components/FeedbackPanel", () => ({
  default: ({ feedback, expectedWord }: { feedback: FeedbackState; expectedWord: string }) =>
    <p data-testid="feedback">{expectedWord}: {feedback.attempt?.score}</p>,
}));
vi.mock("@/lib/api", () => ({
  asrApi: { predict: vi.fn() },
  practiceApi: { submit: vi.fn() },
  wordsApi: { getRandom: vi.fn(), getById: vi.fn() },
  getAuthToken: vi.fn(),
}));

const words: WordItem[] = ["नमस्ते", "पानी"].map((text, index) => ({
  id: `word-${index}`, text_hi: text, transliteration: "", meaning_en: "",
  meaning_hi: "", category: "Test", difficulty: "basic", item_type: "word", audio_url: null,
}));
const result: AsrPredictResult = {
  session_id: "session-1", word_id: "word-0", target_text: "नमस्ते", prediction_text: "नमस्ते",
  accuracy_score: 91, cer: 0.09, is_correct: true, feedback_tier: "excellent",
  feedback: "Good pronunciation", details: { cer_based_score: 91 }, needs_focus: false, streak: 1,
};

beforeEach(() => {
  vi.resetAllMocks();
  navigation.query = "";
  vi.mocked(getAuthToken).mockReturnValue("test-token");
  vi.mocked(wordsApi.getRandom).mockResolvedValue(words);
  vi.mocked(wordsApi.getById).mockResolvedValue(words[1]);
  localStorage.clear();
});
afterEach(cleanup);

async function ready() {
  await waitFor(() => expect((screen.getByRole("button", { name: "Submit recording" }) as HTMLButtonElement).disabled).toBe(false));
}

it("shows a retryable error without fabricating or submitting a score when ASR fails", async () => {
  vi.mocked(asrApi.predict).mockRejectedValue(new Error("ASR unavailable"));
  render(<PracticePage />);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Submit recording" }));
  expect((await screen.findByRole("alert")).textContent).toContain("Please record again");
  expect(practiceApi.submit).not.toHaveBeenCalled();
  expect(screen.queryByTestId("feedback")).toBeNull();
  await ready();
});

it("locks target changes while recording and evaluating, then shows the recorded target", async () => {
  let resolve!: (value: AsrPredictResult) => void;
  vi.mocked(asrApi.predict).mockImplementation(() => new Promise((done) => { resolve = done; }));
  render(<PracticePage />);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
  const targetControls = () => [
    screen.getByRole("button", { name: /Skip/ }),
    screen.getByRole("button", { name: /Prev/ }),
    screen.getByRole("button", { name: /Sentences/ }),
    screen.getByRole("button", { name: "Advanced" }),
  ];
  targetControls().forEach((button) => expect((button as HTMLButtonElement).disabled).toBe(true));
  fireEvent.click(screen.getByRole("button", { name: "Submit recording" }));
  targetControls().forEach((button) => expect((button as HTMLButtonElement).disabled).toBe(true));
  await act(async () => { resolve(result); });
  expect(screen.getByTestId("feedback").textContent).toBe("नमस्ते: 91");
  targetControls().forEach((button) => expect((button as HTMLButtonElement).disabled).toBe(false));
});

it("discards a late result after navigating to a different focus word", async () => {
  let resolve!: (value: AsrPredictResult) => void;
  vi.mocked(asrApi.predict).mockImplementation(() => new Promise((done) => { resolve = done; }));
  const view = render(<PracticePage />);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Submit recording" }));
  navigation.query = "wordId=word-1";
  view.rerender(<PracticePage />);
  await ready();
  await act(async () => { resolve(result); });
  expect(screen.getByTestId("target").textContent).toBe("पानी");
  expect(screen.queryByTestId("feedback")).toBeNull();
});

it("does not simulate pronunciation when the session is missing", async () => {
  vi.mocked(getAuthToken).mockReturnValue(null);
  render(<PracticePage />);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Submit recording" }));
  expect((await screen.findByRole("alert")).textContent).toContain("Please log in again");
  expect(asrApi.predict).not.toHaveBeenCalled();
  expect(practiceApi.submit).not.toHaveBeenCalled();
});
