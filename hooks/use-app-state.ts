'use client';

import { useReducer } from 'react';
import type { AppState, Section, AreaResult, AutobiographyAnswers, ReflectionAnswers, UserInfo } from '@/lib/types';
import { TALENT_AREAS } from '@/lib/data';

type Action =
  | { type: 'GO_TO_SECTION'; section: Section }
  | { type: 'GO_TO_WELCOME' }
  | { type: 'GO_TO_REGISTRATION' }
  | { type: 'GO_TO_FINISHED' }
  | { type: 'SET_SESSION'; sesionId: string; userInfo: UserInfo }
  | { type: 'START_DUEL'; areaIndex: number }
  | { type: 'SELECT_WINNER'; winner: string }
  | { type: 'SHOW_LEADERBOARD' }
  | { type: 'NEXT_AREA' }
  | { type: 'DISMISS_INTRO' }
  | { type: 'TOGGLE_SKIP_OPTIONS' }
  | { type: 'TOGGLE_SKIP_REASON'; reason: string }
  | { type: 'CONFIRM_SKIP'; skipText: string }
  | { type: 'SET_AUTOBIOGRAPHY_ANSWER'; questionId: keyof AutobiographyAnswers; answer: string }
  | { type: 'NEXT_AUTOBIOGRAPHY_QUESTION' }
  | { type: 'PREV_AUTOBIOGRAPHY_QUESTION' }
  | { type: 'SET_REFLECTION_ANSWER'; questionId: keyof ReflectionAnswers; answer: string }
  | { type: 'NEXT_REFLECTION_QUESTION' }
  | { type: 'PREV_REFLECTION_QUESTION' };

const initialState: AppState = {
  currentScreen: 'welcome',
  currentSection: 1,
  sesionId: null,
  userInfo: null,
  section1: {
    currentAreaIndex: 0,
    currentDuelIndex: 0,
    champion: null,
    remainingChallengers: [],
    scores: {},
    areaResults: [],
    showingIntro: false,
    showingLeaderboard: false,
    showingSkipOptions: false,
    selectedSkipReasons: [],
  },
  section2: {
    currentQuestionIndex: 0,
    answers: {
      modelos: '',
      lecturas: '',
      series: '',
      tiempoLibre: '',
      frase: '',
      recuerdos: '',
    },
  },
  section3: {
    currentQuestionIndex: 0,
    answers: {
      multipleChoice1: '',
      multipleChoice2: '',
      felicidad: '',
      infelicidad: '',
      exito: '',
      certeza: '',
    },
  },
};

function initializeArea(areaIndex: number): Partial<AppState['section1']> {
  const area = TALENT_AREAS[areaIndex];
  if (!area) return {};

  const talents = [...area.talents];
  const [champion, ...challengers] = talents;
  const scores: Record<string, number> = {};
  talents.forEach(t => scores[t] = 0);

  return {
    currentAreaIndex: areaIndex,
    currentDuelIndex: 0,
    champion,
    remainingChallengers: challengers,
    scores,
    showingLeaderboard: false,
    showingSkipOptions: false,
    selectedSkipReasons: [],
    // showingIntro is intentionally NOT reset here — it only shows once per session
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'GO_TO_WELCOME':
      return { ...initialState };

    case 'GO_TO_REGISTRATION':
      return { ...state, currentScreen: 'registration' };

    case 'SET_SESSION':
      return {
        ...state,
        sesionId: action.sesionId,
        userInfo: action.userInfo,
        currentScreen: 'section1',
        currentSection: 1,
        section1: {
          ...initialState.section1,
          showingIntro: true,
        },
      };
    
    case 'GO_TO_SECTION': {
      if (action.section === 1) {
        return {
          ...state,
          currentScreen: 'section1',
          currentSection: 1,
          section1: {
            ...state.section1,
            ...initializeArea(0),
            areaResults: [],
            showingIntro: true,
          },
        };
      }
      return {
        ...state,
        currentScreen: `section${action.section}` as 'section1' | 'section2' | 'section3',
        currentSection: action.section,
      };
    }
    
    case 'GO_TO_FINISHED':
      return { ...state, currentScreen: 'finished' };
    
    case 'START_DUEL': {
      return {
        ...state,
        section1: {
          ...state.section1,
          ...initializeArea(action.areaIndex),
        },
      };
    }
    
    case 'SELECT_WINNER': {
      const { champion, remainingChallengers, scores } = state.section1;
      const newChampion = action.winner;
      
      const newScores = { ...scores };
      newScores[newChampion] = (newScores[newChampion] || 0) + 1;
      
      // Remove the challenger that just competed (loser is eliminated, not recycled)
      const newChallengers = remainingChallengers.slice(1);
      
      // Check if area is complete (no more challengers)
      if (newChallengers.length === 0) {
        const rankings = Object.entries(newScores)
          .map(([talent, wins]) => ({ talent, wins }))
          .sort((a, b) => b.wins - a.wins);
        
        const newAreaResult: AreaResult = {
          areaId: TALENT_AREAS[state.section1.currentAreaIndex].id,
          rankings,
          skipped: false,
        };
        
        return {
          ...state,
          section1: {
            ...state.section1,
            champion: newChampion,
            remainingChallengers: newChallengers,
            scores: newScores,
            showingLeaderboard: true,
            areaResults: [...state.section1.areaResults, newAreaResult],
          },
        };
      }
      
      return {
        ...state,
        section1: {
          ...state.section1,
          champion: newChampion,
          remainingChallengers: newChallengers,
          scores: newScores,
          currentDuelIndex: state.section1.currentDuelIndex + 1,
        },
      };
    }
    
    case 'SHOW_LEADERBOARD':
      return {
        ...state,
        section1: { ...state.section1, showingLeaderboard: true },
      };
    
    case 'NEXT_AREA': {
      const nextIndex = state.section1.currentAreaIndex + 1;
      if (nextIndex >= TALENT_AREAS.length) {
        return {
          ...state,
          currentScreen: 'section2',
          currentSection: 2,
        };
      }
      return {
        ...state,
        section1: {
          ...state.section1,
          ...initializeArea(nextIndex),
        },
      };
    }
    
    case 'DISMISS_INTRO':
      return {
        ...state,
        section1: { ...state.section1, showingIntro: false },
      };

    case 'TOGGLE_SKIP_OPTIONS':
      return {
        ...state,
        section1: {
          ...state.section1,
          showingSkipOptions: !state.section1.showingSkipOptions,
          selectedSkipReasons: [],
        },
      };
    
    case 'TOGGLE_SKIP_REASON': {
      const reasons = state.section1.selectedSkipReasons;
      const newReasons = reasons.includes(action.reason)
        ? reasons.filter(r => r !== action.reason)
        : [...reasons, action.reason];
      return {
        ...state,
        section1: {
          ...state.section1,
          selectedSkipReasons: newReasons,
        },
      };
    }
    
    case 'CONFIRM_SKIP': {
      const newAreaResult: AreaResult = {
        areaId: TALENT_AREAS[state.section1.currentAreaIndex].id,
        rankings: [],
        skipped: true,
        skipReasons: state.section1.selectedSkipReasons,
        skipText: action.skipText || undefined,
      };
      
      const nextIndex = state.section1.currentAreaIndex + 1;
      if (nextIndex >= TALENT_AREAS.length) {
        return {
          ...state,
          currentScreen: 'section2',
          currentSection: 2,
          section1: {
            ...state.section1,
            areaResults: [...state.section1.areaResults, newAreaResult],
          },
        };
      }
      
      return {
        ...state,
        section1: {
          ...state.section1,
          ...initializeArea(nextIndex),
          areaResults: [...state.section1.areaResults, newAreaResult],
        },
      };
    }
    
    case 'SET_AUTOBIOGRAPHY_ANSWER':
      return {
        ...state,
        section2: {
          ...state.section2,
          answers: {
            ...state.section2.answers,
            [action.questionId]: action.answer,
          },
        },
      };
    
    case 'NEXT_AUTOBIOGRAPHY_QUESTION': {
      const nextIndex = state.section2.currentQuestionIndex + 1;
      if (nextIndex >= 6) {
        return {
          ...state,
          currentScreen: 'section3',
          currentSection: 3,
        };
      }
      return {
        ...state,
        section2: {
          ...state.section2,
          currentQuestionIndex: nextIndex,
        },
      };
    }
    
    case 'PREV_AUTOBIOGRAPHY_QUESTION': {
      const prevIndex = state.section2.currentQuestionIndex - 1;
      if (prevIndex < 0) {
        return {
          ...state,
          currentScreen: 'section1',
          currentSection: 1,
        };
      }
      return {
        ...state,
        section2: {
          ...state.section2,
          currentQuestionIndex: prevIndex,
        },
      };
    }
    
    case 'SET_REFLECTION_ANSWER':
      return {
        ...state,
        section3: {
          ...state.section3,
          answers: {
            ...state.section3.answers,
            [action.questionId]: action.answer,
          },
        },
      };
    
    case 'NEXT_REFLECTION_QUESTION': {
      const totalQuestions = 6; // 2 MC + 4 reflection
      const nextIndex = state.section3.currentQuestionIndex + 1;
      if (nextIndex >= totalQuestions) {
        return {
          ...state,
          currentScreen: 'finished',
        };
      }
      return {
        ...state,
        section3: {
          ...state.section3,
          currentQuestionIndex: nextIndex,
        },
      };
    }
    
    case 'PREV_REFLECTION_QUESTION': {
      const prevIndex = state.section3.currentQuestionIndex - 1;
      if (prevIndex < 0) {
        return {
          ...state,
          currentScreen: 'section2',
          currentSection: 2,
          section2: {
            ...state.section2,
            currentQuestionIndex: 5,
          },
        };
      }
      return {
        ...state,
        section3: {
          ...state.section3,
          currentQuestionIndex: prevIndex,
        },
      };
    }
    
    default:
      return state;
  }
}

export function useAppState() {
  return useReducer(reducer, initialState);
}
