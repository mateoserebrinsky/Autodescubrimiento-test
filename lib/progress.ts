import { TALENT_AREAS, AUTOBIOGRAPHY_QUESTIONS, MULTIPLE_CHOICE_QUESTIONS, REFLECTION_QUESTIONS } from './data';
import type { AppState, ProgressSnapshot } from './types';

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Overall completion percentage (0-100), used both to display progress and to
 * persist "porcentaje_avance" in progreso_sesion.
 *
 * Each of the 3 sections is treated as an equal third of the test; within a
 * section, progress is the fraction of its steps (talent areas / questions)
 * already completed.
 */
export function calculateProgressPercentage(state: AppState): number {
  if (state.currentScreen === 'finished') return 100;
  if (state.currentScreen === 'welcome' || state.currentScreen === 'registration') return 0;

  const section2Total = AUTOBIOGRAPHY_QUESTIONS.length;
  const section3Total = MULTIPLE_CHOICE_QUESTIONS.length + REFLECTION_QUESTIONS.length;

  const section1Fraction = clamp01(state.section1.areaResults.length / TALENT_AREAS.length);
  const section2Fraction = clamp01(state.section2.currentQuestionIndex / section2Total);
  const section3Fraction = clamp01(state.section3.currentQuestionIndex / section3Total);

  let completedThirds: number;
  switch (state.currentSection) {
    case 1:
      completedThirds = section1Fraction;
      break;
    case 2:
      completedThirds = 1 + section2Fraction;
      break;
    case 3:
    default:
      completedThirds = 2 + section3Fraction;
      break;
  }

  return Math.round(clamp01(completedThirds / 3) * 100);
}

/** Extracts the subset of AppState needed to fully restore the test later. */
export function buildProgressSnapshot(state: AppState): ProgressSnapshot {
  return {
    currentScreen: state.currentScreen,
    currentSection: state.currentSection,
    section1: state.section1,
    section2: state.section2,
    section3: state.section3,
  };
}
