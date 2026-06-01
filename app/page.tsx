'use client';

import { useAppState } from '@/hooks/use-app-state';
import { WelcomeScreen } from '@/components/welcome-screen';
import { TalentDuels } from '@/components/talent-duels';
import { AutobiographySection } from '@/components/autobiography-section';
import { ReflectionSection } from '@/components/reflection-section';
import { FinishedScreen } from '@/components/finished-screen';
import type { AutobiographyAnswers, ReflectionAnswers } from '@/lib/types';

export default function Home() {
  const [state, dispatch] = useAppState();

  const handleStart = () => {
    dispatch({ type: 'GO_TO_SECTION', section: 1 });
  };

  const handleRestart = () => {
    dispatch({ type: 'GO_TO_WELCOME' });
  };

  // Section 1 handlers
  const handleSelectWinner = (winner: string) => {
    dispatch({ type: 'SELECT_WINNER', winner });
  };

  const handleNextArea = () => {
    dispatch({ type: 'NEXT_AREA' });
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

  const handleConfirmSkip = (skipText: string) => {
    dispatch({ type: 'CONFIRM_SKIP', skipText });
  };

  // Section 2 handlers
  const handleAutobiographyAnswer = (questionId: keyof AutobiographyAnswers, answer: string) => {
    dispatch({ type: 'SET_AUTOBIOGRAPHY_ANSWER', questionId, answer });
  };

  const handleAutobiographyNext = () => {
    dispatch({ type: 'NEXT_AUTOBIOGRAPHY_QUESTION' });
  };

  const handleAutobiographyPrevious = () => {
    dispatch({ type: 'PREV_AUTOBIOGRAPHY_QUESTION' });
  };

  // Section 3 handlers
  const handleReflectionAnswer = (questionId: keyof ReflectionAnswers, answer: string) => {
    dispatch({ type: 'SET_REFLECTION_ANSWER', questionId, answer });
  };

  const handleReflectionNext = () => {
    dispatch({ type: 'NEXT_REFLECTION_QUESTION' });
  };

  const handleReflectionPrevious = () => {
    dispatch({ type: 'PREV_REFLECTION_QUESTION' });
  };

  switch (state.currentScreen) {
    case 'welcome':
      return <WelcomeScreen onStart={handleStart} />;

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
