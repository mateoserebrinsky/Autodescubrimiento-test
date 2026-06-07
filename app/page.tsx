'use client';

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

  // Welcome screen: go to registration form
  const handleStart = () => {
    dispatch({ type: 'GO_TO_REGISTRATION' });
  };

  const handleRestart = () => {
    dispatch({ type: 'GO_TO_WELCOME' });
  };

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

  // Section 1 handlers
  const handleSelectWinner = (winner: string) => {
    dispatch({ type: 'SELECT_WINNER', winner });
  };

  // When section 1 finishes, save duelos to Supabase then advance to section 2
  const handleNextArea = async () => {
    const nextIndex = state.section1.currentAreaIndex + 1;
    const isLastArea = nextIndex >= (await import('@/lib/data')).TALENT_AREAS.length;

    if (isLastArea && state.sesionId) {
      try {
        await fetch('/api/duelos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sesionId: state.sesionId,
            areaResults: state.section1.areaResults,
          }),
        });
      } catch (err) {
        console.error('[page] Error guardando duelos:', err);
      }
    }

    dispatch({ type: 'NEXT_AREA' });
  };

  const handleConfirmSkip = async (skipText: string) => {
    const nextIndex = state.section1.currentAreaIndex + 1;
    const talentAreas = (await import('@/lib/data')).TALENT_AREAS;
    const isLastArea = nextIndex >= talentAreas.length;

    // Dispatch skip first so areaResults is updated before we save
    dispatch({ type: 'CONFIRM_SKIP', skipText });

    if (isLastArea && state.sesionId) {
      // Build the full results including the current skipped area
      const currentArea = talentAreas[state.section1.currentAreaIndex];
      const skippedResult = {
        areaId: currentArea.id,
        rankings: [],
        skipped: true,
        skipReasons: state.section1.selectedSkipReasons,
        skipText: skipText || undefined,
      };
      const allResults = [...state.section1.areaResults, skippedResult];

      try {
        await fetch('/api/duelos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sesionId: state.sesionId,
            areaResults: allResults,
          }),
        });
      } catch (err) {
        console.error('[page] Error guardando omision final:', err);
      }
    }
  };

  const handleDismissIntro = () => {
    dispatch({ type: 'DISMISS_INTRO' });
  };

  const handleToggleSkipOptions = () => {
    dispatch({ type: 'TOGGLE_SKIP_OPTIONS' });
  };

  const handleToggleSkipReason = (reason: string) => {
    dispatch({ type: 'TOGGLE_SKIP_REASON', reason });
  };

  // Section 2 handlers
  const handleAutobiographyAnswer = (questionId: keyof AutobiographyAnswers, answer: string) => {
    dispatch({ type: 'SET_AUTOBIOGRAPHY_ANSWER', questionId, answer });
  };

  // When autobiography finishes, save to Supabase then advance to section 3
  const handleAutobiographyNext = async () => {
    const isLastQuestion = state.section2.currentQuestionIndex >= 5;

    if (isLastQuestion && state.sesionId) {
      try {
        await fetch('/api/autobiografia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sesionId: state.sesionId,
            answers: state.section2.answers,
          }),
        });
      } catch (err) {
        console.error('[page] Error guardando autobiografia:', err);
      }
    }

    dispatch({ type: 'NEXT_AUTOBIOGRAPHY_QUESTION' });
  };

  const handleAutobiographyPrevious = () => {
    dispatch({ type: 'PREV_AUTOBIOGRAPHY_QUESTION' });
  };

  // Section 3 handlers
  const handleReflectionAnswer = (questionId: keyof ReflectionAnswers, answer: string) => {
    dispatch({ type: 'SET_REFLECTION_ANSWER', questionId, answer });
  };

  // When reflection finishes, save to Supabase (marks session complete) then go to finished
  const handleReflectionNext = async () => {
    const totalQuestions = 6;
    const isLastQuestion = state.section3.currentQuestionIndex >= totalQuestions - 1;

    if (isLastQuestion && state.sesionId) {
      try {
        await fetch('/api/reflexion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sesionId: state.sesionId,
            answers: state.section3.answers,
          }),
        });
      } catch (err) {
        console.error('[page] Error guardando reflexion:', err);
      }
    }

    dispatch({ type: 'NEXT_REFLECTION_QUESTION' });
  };

  const handleReflectionPrevious = () => {
    dispatch({ type: 'PREV_REFLECTION_QUESTION' });
  };

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
