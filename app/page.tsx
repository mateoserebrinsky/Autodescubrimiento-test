'use client';

import { useEffect, useRef } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { WelcomeScreen } from '@/components/welcome-screen';
import { RegistrationForm } from '@/components/registration-form';
import { TalentDuels } from '@/components/talent-duels';
import { AutobiographySection } from '@/components/autobiography-section';
import { ReflectionSection } from '@/components/reflection-section';
import { FinishedScreen } from '@/components/finished-screen';
import type { AutobiographyAnswers, ReflectionAnswers, UserInfo } from '@/lib/types';

export default function Home() {
  const [state, dispatch] = useAppState();

  // Track which saves have already been sent to avoid double-posting
  const savedDuelos = useRef(false);
  const savedAutobiografia = useRef(false);
  const savedReflexion = useRef(false);

  // Reset save flags when the session resets
  useEffect(() => {
    if (state.currentScreen === 'welcome') {
      savedDuelos.current = false;
      savedAutobiografia.current = false;
      savedReflexion.current = false;
    }
  }, [state.currentScreen]);

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
