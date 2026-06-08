'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { WelcomeScreen } from '@/components/welcome-screen';
import { RegistrationForm } from '@/components/registration-form';
import { TalentDuels } from '@/components/talent-duels';
import { AutobiographySection } from '@/components/autobiography-section';
import { ReflectionSection } from '@/components/reflection-section';
import { FinishedScreen } from '@/components/finished-screen';
import { calculateProgressPercentage, buildProgressSnapshot } from '@/lib/progress';
import type { AutobiographyAnswers, ReflectionAnswers, ProgresoRecord, UserInfo } from '@/lib/types';

// Remembers which session belongs to this browser so a reload/return can be
// matched back to the right `sesion_id` and its auto-saved progress restored.
const SESSION_STORAGE_KEY = 'autodescubrimiento:sesion';

interface StoredSession {
  sesionId: number;
  userInfo: UserInfo;
}

function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (!parsed.sesionId || !parsed.userInfo) return null;
    return { sesionId: parsed.sesionId, userInfo: parsed.userInfo };
  } catch {
    return null;
  }
}

export default function Home() {
  const [state, dispatch] = useAppState();

  // While true we're checking localStorage/the server for a session to resume,
  // so we don't flash the welcome screen before deciding where to land.
  const [isRestoring, setIsRestoring] = useState(true);

  // Track which saves have already been sent to avoid double-posting
  const savedDuelos = useRef(false);
  const savedAutobiografia = useRef(false);
  const savedReflexion = useRef(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On first load: look for a session remembered in this browser and, if it
  // has saved progress, restore the test exactly where the user left it
  // (Definition of Done: "el sistema recupera correctamente el último estado guardado").
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const stored = readStoredSession();
        if (!stored) return;

        const res = await fetch(`/api/progreso?sesionId=${stored.sesionId}`);
        if (!res.ok || cancelled) return;

        const { progreso }: { progreso: ProgresoRecord | null } = await res.json();
        if (cancelled) return;

        if (progreso && progreso.pantallaActual !== 'welcome' && progreso.pantallaActual !== 'finished') {
          dispatch({
            type: 'RESTORE_PROGRESS',
            sesionId: stored.sesionId,
            userInfo: stored.userInfo,
            snapshot: progreso.estado,
          });
        } else if (!progreso) {
          // Registration succeeded previously but nothing was auto-saved yet —
          // resume at the start of the test instead of asking to register again.
          dispatch({ type: 'SET_SESSION', sesionId: stored.sesionId, userInfo: stored.userInfo });
        }
      } catch (err) {
        console.error('[page] Error restaurando progreso:', err);
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remember the session in this browser as soon as it's created/restored, so
  // quitting and coming back can be matched to the right sesion_id.
  useEffect(() => {
    if (state.sesionId && state.userInfo) {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ sesionId: state.sesionId, userInfo: state.userInfo } satisfies StoredSession),
      );
    }
  }, [state.sesionId, state.userInfo]);

  // Forget the remembered session once it's done — a finished test shouldn't
  // be "resumed" back into its last question.
  useEffect(() => {
    if (state.currentScreen === 'finished') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [state.currentScreen]);

  // Reset save flags when the session resets
  useEffect(() => {
    if (state.currentScreen === 'welcome') {
      savedDuelos.current = false;
      savedAutobiografia.current = false;
      savedReflexion.current = false;
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [state.currentScreen]);

  // Auto-save progress (open answers, duel state, current screen/section and
  // % advance) as the user moves through the test, debounced so we don't spam
  // the API on every keystroke. This is what lets someone quit mid-question,
  // go back, or close the tab without losing what they've entered so far.
  useEffect(() => {
    if (!state.sesionId) return;
    if (state.currentScreen === 'welcome' || state.currentScreen === 'registration') return;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

    autosaveTimer.current = setTimeout(() => {
      fetch('/api/progreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sesionId: state.sesionId,
          snapshot: buildProgressSnapshot(state),
          porcentajeAvance: calculateProgressPercentage(state),
        }),
      }).catch((err) => console.error('[page] Error autoguardando progreso:', err));
    }, 800);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.sesionId,
    state.currentScreen,
    state.currentSection,
    state.section1,
    state.section2,
    state.section3,
  ]);

  // Save duelos when section 1 finishes (user enters section 2)
  useEffect(() => {
    if (
      state.currentScreen === 'section2' &&
      state.sesionId &&
      !savedDuelos.current
    ) {
      savedDuelos.current = true;
      fetch('/api/duelos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sesionId: state.sesionId,
          areaResults: state.section1.areaResults,
        }),
      }).catch((err) => console.error('[page] Error guardando duelos:', err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentScreen]);

  // Save autobiografía when section 2 finishes (user enters section 3)
  useEffect(() => {
    if (
      state.currentScreen === 'section3' &&
      state.sesionId &&
      !savedAutobiografia.current
    ) {
      savedAutobiografia.current = true;
      fetch('/api/autobiografia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sesionId: state.sesionId,
          answers: state.section2.answers,
        }),
      }).catch((err) => console.error('[page] Error guardando autobiografia:', err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentScreen]);

  // Save reflexión when section 3 finishes (user reaches finished screen)
  useEffect(() => {
    if (
      state.currentScreen === 'finished' &&
      state.sesionId &&
      !savedReflexion.current
    ) {
      savedReflexion.current = true;
      fetch('/api/reflexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sesionId: state.sesionId,
          answers: state.section3.answers,
        }),
      }).catch((err) => console.error('[page] Error guardando reflexion:', err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentScreen]);

  // ── Navigation handlers ──────────────────────────────────────

  const handleStart = () => dispatch({ type: 'GO_TO_REGISTRATION' });
  const handleRestart = () => dispatch({ type: 'GO_TO_WELCOME' });

  // Registration: create user + session in Supabase, then start section 1
  const handleRegistrationConfirm = async (userInfo: UserInfo) => {
    const res = await fetch('/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? 'Error al registrar');
    }

    const { sesionId } = await res.json();
    dispatch({ type: 'SET_SESSION', sesionId, userInfo });
  };

  // Section 1
  const handleSelectWinner = (winner: string) => dispatch({ type: 'SELECT_WINNER', winner });
  const handleNextArea = () => dispatch({ type: 'NEXT_AREA' });
  const handleDismissIntro = () => dispatch({ type: 'DISMISS_INTRO' });
  const handleToggleSkipOptions = () => dispatch({ type: 'TOGGLE_SKIP_OPTIONS' });
  const handleToggleSkipReason = (reason: string) => dispatch({ type: 'TOGGLE_SKIP_REASON', reason });
  const handleConfirmSkip = (skipText: string) => dispatch({ type: 'CONFIRM_SKIP', skipText });

  // Section 2
  const handleAutobiographyAnswer = (questionId: keyof AutobiographyAnswers, answer: string) =>
    dispatch({ type: 'SET_AUTOBIOGRAPHY_ANSWER', questionId, answer });
  const handleAutobiographyNext = () => dispatch({ type: 'NEXT_AUTOBIOGRAPHY_QUESTION' });
  const handleAutobiographyPrevious = () => dispatch({ type: 'PREV_AUTOBIOGRAPHY_QUESTION' });

  // Section 3
  const handleReflectionAnswer = (questionId: keyof ReflectionAnswers, answer: string) =>
    dispatch({ type: 'SET_REFLECTION_ANSWER', questionId, answer });
  const handleReflectionNext = () => dispatch({ type: 'NEXT_REFLECTION_QUESTION' });
  const handleReflectionPrevious = () => dispatch({ type: 'PREV_REFLECTION_QUESTION' });

  // ── Screen rendering ─────────────────────────────────────────

  // Avoid flashing the welcome screen while we check for a session to resume
  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  switch (state.currentScreen) {
    case 'welcome':
      return <WelcomeScreen onStart={handleStart} />;

    case 'registration':
      return (
        <RegistrationForm
          onConfirm={handleRegistrationConfirm}
          onBack={() => dispatch({ type: 'GO_TO_WELCOME' })}
        />
      );

    case 'section1':
      return (
        <TalentDuels
          state={state.section1}
          onSelectWinner={handleSelectWinner}
          onNextArea={handleNextArea}
          onDismissIntro={handleDismissIntro}
          onToggleSkipOptions={handleToggleSkipOptions}
          onToggleSkipReason={handleToggleSkipReason}
          onConfirmSkip={handleConfirmSkip}
        />
      );

    case 'section2':
      return (
        <AutobiographySection
          currentQuestionIndex={state.section2.currentQuestionIndex}
          answers={state.section2.answers}
          onAnswer={handleAutobiographyAnswer}
          onNext={handleAutobiographyNext}
          onPrevious={handleAutobiographyPrevious}
        />
      );

    case 'section3':
      return (
        <ReflectionSection
          currentQuestionIndex={state.section3.currentQuestionIndex}
          answers={state.section3.answers}
          onAnswer={handleReflectionAnswer}
          onNext={handleReflectionNext}
          onPrevious={handleReflectionPrevious}
        />
      );

    case 'finished':
      return <FinishedScreen onRestart={handleRestart} />;

    default:
      return <WelcomeScreen onStart={handleStart} />;
  }
}
