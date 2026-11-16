import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import ProfilePage from "@/app/profile/page";
import { profileApi, type DifficultyProgress } from "@/lib/api";
import { i18n } from "@/lib/i18n";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/components/AuthGuard", () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/AuthProvider", () => ({ useAuth: () => ({ isLoggedIn: true, logout: vi.fn() }) }));
vi.mock("@/lib/api", () => ({ profileApi: {
  getSummary: vi.fn(), getFocusWords: vi.fn(), getStreakCalendar: vi.fn(), getProgress: vi.fn(),
} }));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(profileApi.getSummary).mockResolvedValue({
    user: { id: "user", full_name: "New Learner", email: "learner@example.com", created_at: "2026-01-01" },
    streak: { current_streak: 0, longest_streak: 0, total_practice_days: 0 },
    stats: { unique_words_practiced: 0, total_attempts: 0, overall_accuracy: 0, focus_words_count: 0, total_words_available: 560 },
  });
  vi.mocked(profileApi.getFocusWords).mockResolvedValue({ focus_words: [], count: 0 });
  vi.mocked(profileApi.getStreakCalendar).mockResolvedValue({ calendar: [] });
  vi.mocked(profileApi.getProgress).mockResolvedValue({ breakdown: Object.fromEntries(
    ["basic", "intermediate", "advanced"].map((key) => [key, {
      total_words: 100, attempted_words: 0, mastered_words: 0, avg_accuracy: 0, completion_percentage: 0,
    }]),
  ) } as DifficultyProgress);
});
afterEach(cleanup);

it("keeps a real empty profile empty without showing demo weak words or statistics", async () => {
  render(<ProfilePage />);
  expect(screen.getByRole("status").textContent).toContain("Loading");
  expect(await screen.findByText("New Learner")).toBeTruthy();
  expect(screen.getByText(i18n.en.noData)).toBeTruthy();
  expect(screen.queryByText("राहुल शर्मा")).toBeNull();
  expect(screen.queryByText("विद्यालय")).toBeNull();
  expect(screen.queryByText("87")).toBeNull();
  expect(screen.getAllByText(/0 \/ 100/)).toHaveLength(3);
});

it("shows a retryable error instead of sample progress when a profile request fails", async () => {
  vi.mocked(profileApi.getProgress).mockRejectedValueOnce(new Error("Offline"));
  render(<ProfilePage />);
  expect((await screen.findByRole("alert")).textContent).toContain("could not load your progress");
  expect(screen.queryByText("New Learner")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  expect(await screen.findByText("New Learner")).toBeTruthy();
});
