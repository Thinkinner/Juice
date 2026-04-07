import type {
  FlavorPreference,
  SensitivityOption,
  UnlockedSession,
  WellnessGoal,
} from "@/lib/types";

const QUIZ_KEY = "juice-finder-quiz-v1";
const SESSION_KEY = "juice-finder-session-v1";

export interface StoredQuizProgress {
  step: number;
  goal?: WellnessGoal;
  sensitivities?: SensitivityOption[];
  flavor?: FlavorPreference;
  zip?: string;
  emailDraft?: string;
}

export function loadQuizProgress(): StoredQuizProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredQuizProgress;
  } catch {
    return null;
  }
}

export function saveQuizProgress(data: StoredQuizProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZ_KEY, JSON.stringify(data));
}

export function clearQuizProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QUIZ_KEY);
}

export function saveSession(session: UnlockedSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): UnlockedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UnlockedSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
