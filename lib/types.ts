export type Screen = 
  | 'welcome'
  | 'registration'
  | 'section1'
  | 'section2'
  | 'section3'
  | 'finished';

export interface UserInfo {
  nombre: string;
  apellido: string;
  edad: string;
}

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
  skipText?: string;
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

// Subset of AppState that fully describes "where the user is" — enough to
// restore the test exactly where they left it after quitting/reloading.
export type ProgressSnapshot = Pick<
  AppState,
  'currentScreen' | 'currentSection' | 'section1' | 'section2' | 'section3'
>;

// Shape returned by GET /api/progreso (row from progreso_sesion, or null if none yet)
export interface ProgresoRecord {
  pantallaActual: Screen;
  seccionActual: Section;
  porcentajeAvance: number;
  estado: ProgressSnapshot;
  iniciadoEn: string;
  actualizadoEn: string;
}

export interface AppState {
  currentScreen: Screen;
  currentSection: Section;
  sesionId: number | null;
  userInfo: UserInfo | null;
  section1: {
    currentAreaIndex: number;
    currentDuelIndex: number;
    champion: string | null;
    remainingChallengers: string[];
    scores: Record<string, number>;
    areaResults: AreaResult[];
    showingIntro: boolean;
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
