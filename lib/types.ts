export type Screen = 
  | 'welcome'
  | 'section1'
  | 'section2'
  | 'section3'
  | 'finished';

export type Section = 1 | 2 | 3;

export interface TalentArea {
  id: string;
  name: string;
  talents: string[];
}

export interface TalentScore {
  talent: string;
  wins: number;
}

export interface AreaResult {
  areaId: string;
  rankings: TalentScore[];
  skipped: boolean;
  skipReasons?: string[];
}

export interface AutobiographyAnswers {
  modelos: string;
  lecturas: string;
  series: string;
  tiempoLibre: string;
  frase: string;
  recuerdos: string;
}

export interface ReflectionAnswers {
  multipleChoice1: string;
  multipleChoice2: string;
  felicidad: string;
  infelicidad: string;
  exito: string;
  certeza: string;
}

export interface AppState {
  currentScreen: Screen;
  currentSection: Section;
  section1: {
    currentAreaIndex: number;
    currentDuelIndex: number;
    champion: string | null;
    remainingChallengers: string[];
    scores: Record<string, number>;
    areaResults: AreaResult[];
    showingLeaderboard: boolean;
    showingSkipOptions: boolean;
    selectedSkipReasons: string[];
  };
  section2: {
    currentQuestionIndex: number;
    answers: AutobiographyAnswers;
  };
  section3: {
    currentQuestionIndex: number;
    answers: ReflectionAnswers;
  };
}
