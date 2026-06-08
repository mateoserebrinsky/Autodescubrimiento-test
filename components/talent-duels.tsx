'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from '@/components/header';
import { TALENT_AREAS, SKIP_REASONS } from '@/lib/data';
import type { AppState } from '@/lib/types';
import {
  ArrowLeftRight,
  ThumbsUp,
  TrendingUp,
  SkipForward,
  Check,
} from 'lucide-react';

// ── Intro screen ──────────────────────────────────────────────

const INTRO_ITEMS = [
  {
    Icon: ArrowLeftRight,
    text: 'En cada ronda vas a ver dos actividades o talentos enfrentados.',
  },
  {
    Icon: ThumbsUp,
    text: 'Elegí la que más te representa o en la que te sentís más capaz.',
  },
  {
    Icon: TrendingUp,
    text: 'La ganadora sigue compitiendo contra otras. Cuantas más veces gane, más alta será su posición en el ranking de esa área.',
  },
  {
    Icon: SkipForward,
    text: 'Si un área no te interesa para nada, podés omitirla y contarnos por qué.',
  },
];

function DuelIntro({ onStart }: { onStart: () => void }) {
  return (
    <>
      <Header currentSection={1} />
      <main className="min-h-screen pt-32 pb-8 px-4">
        <div className="mx-auto max-w-md pt-4 space-y-5">
          <h2 className="text-2xl font-bold text-foreground text-center">
            ¿Cómo funciona esta sección?
          </h2>

          <div className="space-y-3">
            {INTRO_ITEMS.map(({ Icon, text }, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-card border border-border rounded-xl p-4 shadow-sm"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed pt-1.5">{text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onStart}
            className="w-full rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:brightness-105 active:scale-[0.98]"
          >
            ¡Empezar!
          </button>
        </div>
      </main>
    </>
  );
}

// ── Talent card ───────────────────────────────────────────────

type CardState = 'idle' | 'win' | 'lose';

interface TalentCardProps {
  role: 'favorite' | 'challenger';
  talent: string;
  cardState: CardState;
  onDecide: (kind: 'mas' | 'menos') => void;
}

function TalentCard({ role, talent, cardState, onDecide }: TalentCardProps) {
  const isFav = role === 'favorite';

  return (
    <div
      className={[
        'relative flex w-full flex-col items-center justify-center gap-4 rounded-xl border bg-card p-5 text-center transition-all duration-500 min-h-[140px]',
        cardState === 'win'
          ? 'scale-[1.015] border-primary/50 shadow-md'
          : cardState === 'lose'
          ? 'scale-[0.97] opacity-40'
          : 'border-border shadow-sm',
      ].join(' ')}
    >
      {/* Checkmark badge */}
      <div
        className={[
          'absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all duration-300',
          cardState === 'win' ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        ].join(' ')}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      {/* Tag */}
      <span
        className={[
          'text-[10.5px] font-semibold uppercase tracking-widest',
          isFav ? 'text-muted-foreground' : 'text-primary',
        ].join(' ')}
      >
        {isFav ? 'Tu favorito' : 'Nueva opción'}
      </span>

      {/* Talent name */}
      <p className="text-xl font-bold leading-tight text-foreground">{talent}</p>

      {/* Action buttons (challenger only) */}
      {!isFav && (
        <div className="flex w-full flex-col gap-2">
          <button
            disabled={cardState !== 'idle'}
            onClick={() => onDecide('mas')}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
          >
            Me gusta más
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
          <button
            disabled={cardState !== 'idle'}
            onClick={() => onDecide('menos')}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-muted active:scale-[0.98] disabled:opacity-50"
          >
            Me gusta menos
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Skip modal ────────────────────────────────────────────────

interface SkipModalProps {
  selectedReasons: string[];
  skipText: string;
  onToggleReason: (r: string) => void;
  onSkipTextChange: (t: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function SkipModal({
  selectedReasons,
  skipText,
  onToggleReason,
  onSkipTextChange,
  onConfirm,
  onCancel,
}: SkipModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              ¿Por qué omitís esta área?
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Podés elegir más de una opción.
            </p>
          </div>

          {/* Reason chips */}
          <div className="flex flex-wrap gap-2">
            {SKIP_REASONS.map((reason) => {
              const selected = selectedReasons.includes(reason);
              return (
                <button
                  key={reason}
                  onClick={() => onToggleReason(reason)}
                  className={[
                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                    selected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:bg-muted',
                  ].join(' ')}
                >
                  {reason}
                </button>
              );
            })}
          </div>

          {/* Free text */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              ¿Querés agregar algo más?
            </label>
            <textarea
              value={skipText}
              onChange={(e) => onSkipTextChange(e.target.value)}
              placeholder="Contanos con tus palabras..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-105 active:scale-[0.98]"
            >
              Omitir área
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Circular progress ─────────────────────────────────────────

function CircularProgress({
  value,
  max,
  size = 46,
  stroke = 5,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-secondary" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-primary"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold leading-none">
        {value}
        <span className="text-muted-foreground font-medium text-[11px]">/{max}</span>
      </div>
    </div>
  );
}

// ── Area transition modal ──────────────────────────────────────

function AreaTransitionModal({
  omitted,
  nextName,
}: {
  omitted: boolean;
  nextName: string;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/20 backdrop-blur-sm px-6">
      <div
        className="w-full max-w-[300px] rounded-2xl border border-border bg-card p-7 text-center shadow-xl"
        style={{ animation: 'duel-pop 0.28s ease-out both' }}
      >
        <div
          className={[
            'mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl',
            omitted ? 'bg-secondary text-muted-foreground' : 'bg-primary/10 text-primary',
          ].join(' ')}
        >
          {omitted ? <SkipForward className="h-7 w-7" /> : <Check className="h-7 w-7" strokeWidth={3} />}
        </div>
        <h3 className="text-lg font-bold text-foreground">
          {omitted ? 'Área omitida' : '¡Área completada!'}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">Avanzás a la siguiente área</p>
        <div className="mt-3 border-t border-border pt-3">
          <div className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground">
            A continuación
          </div>
          <p className="mt-1 text-[15px] font-bold leading-tight text-foreground">{nextName}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

interface TalentDuelsProps {
  state: AppState['section1'];
  onSelectWinner: (winner: string) => void;
  onNextArea: () => void;
  onDismissIntro: () => void;
  onToggleSkipOptions: () => void;
  onToggleSkipReason: (reason: string) => void;
  onConfirmSkip: (skipText: string) => void;
}

export function TalentDuels({
  state,
  onSelectWinner,
  onNextArea,
  onDismissIntro,
  onToggleSkipOptions,
  onToggleSkipReason,
  onConfirmSkip,
}: TalentDuelsProps) {
  const currentArea = TALENT_AREAS[state.currentAreaIndex];
  const totalDuels = currentArea.talents.length - 1;

  const [favoriteSlot, setFavoriteSlot] = useState<'top' | 'bottom'>('top');
  const [choice, setChoice] = useState<'mas' | 'menos' | null>(null);
  const [skipText, setSkipText] = useState('');
  const [areaTransition, setAreaTransition] =
    useState<{ omitted: boolean; nextName: string } | null>(null);
  const lock = useRef(false);
  const prevAreaIndex = useRef(state.currentAreaIndex);

  // Reset slot state when a new area starts
  useEffect(() => {
    setFavoriteSlot('top');
    setChoice(null);
    lock.current = false;
  }, [state.currentAreaIndex]);

  // Clear skip text when the modal closes
  useEffect(() => {
    if (!state.showingSkipOptions) setSkipText('');
  }, [state.showingSkipOptions]);

  // Auto-advance past the (removed) leaderboard screen
  useEffect(() => {
    if (state.showingLeaderboard) {
      onNextArea();
    }
  // onNextArea is a stable dispatch wrapper — only re-run when showingLeaderboard changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.showingLeaderboard]);

  // Area transition modal
  useEffect(() => {
    if (prevAreaIndex.current === state.currentAreaIndex) return;
    const movedForward = state.currentAreaIndex > prevAreaIndex.current;
    prevAreaIndex.current = state.currentAreaIndex;
    if (!movedForward) return;
    const last = state.areaResults[state.areaResults.length - 1];
    setAreaTransition({
      omitted: !!(last && last.skipped),
      nextName: TALENT_AREAS[state.currentAreaIndex].name,
    });
    const t = setTimeout(() => setAreaTransition(null), 1100);
    return () => clearTimeout(t);
  }, [state.currentAreaIndex]);

  const challenger = state.remainingChallengers[0];
  const challengerSlot: 'top' | 'bottom' = favoriteSlot === 'top' ? 'bottom' : 'top';

  const decide = useCallback(
    (kind: 'mas' | 'menos') => {
      if (lock.current || !state.champion || !challenger) return;
      lock.current = true;
      setChoice(kind);

      const winner = kind === 'mas' ? challenger : state.champion;
      const winnerSlot = kind === 'mas' ? challengerSlot : favoriteSlot;

      setTimeout(() => {
        setFavoriteSlot(winnerSlot);
        setChoice(null);
        lock.current = false;
        onSelectWinner(winner);
      }, 680);
    },
    [state.champion, challenger, favoriteSlot, challengerSlot, onSelectWinner],
  );

  // ── Intro screen ──
  if (state.showingIntro) {
    return <DuelIntro onStart={onDismissIntro} />;
  }

  // ── Transitioning (auto-advancing leaderboard) ──
  if (state.showingLeaderboard || !state.champion || !challenger) {
    return (
      <>
        <Header currentSection={1} />
        <main className="min-h-screen" />
      </>
    );
  }

  const favState: CardState =
    choice === 'menos' ? 'win' : choice === 'mas' ? 'lose' : 'idle';
  const chalState: CardState =
    choice === 'mas' ? 'win' : choice === 'menos' ? 'lose' : 'idle';

  const favCard = (
    <TalentCard
      role="favorite"
      talent={state.champion}
      cardState={favState}
      onDecide={decide}
    />
  );
  const chalCard = (
    <TalentCard
      role="challenger"
      talent={challenger}
      cardState={chalState}
      onDecide={decide}
    />
  );

  const vsBadge = (
    <div
      className={[
        'pointer-events-none shrink-0 mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all duration-300',
        choice ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
      ].join(' ')}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        vs
      </span>
    </div>
  );

  const progressWidget = (
    <div className="flex items-center gap-3.5">
      <CircularProgress value={state.currentDuelIndex} max={totalDuels} />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">
          Área {state.currentAreaIndex + 1}
          <span className="font-normal text-muted-foreground"> de {TALENT_AREAS.length}</span>
        </span>
        <span className="text-xs text-muted-foreground">
          {state.currentDuelIndex} de {totalDuels} duelos respondidos
        </span>
      </div>
    </div>
  );

  const skipButton = (fullWidth: boolean) => (
    <button
      onClick={onToggleSkipOptions}
      className={[
        'flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-muted active:scale-[0.98]',
        fullWidth ? 'w-full' : '',
      ].join(' ')}
    >
      <SkipForward className="w-4 h-4" />
      Omitir esta área
    </button>
  );

  return (
    <>
      <Header currentSection={1} />

      {/* ── MOBILE LAYOUT (below md) ─────────────────────────────── */}
      <main className="md:hidden flex flex-col items-center pt-32" style={{ height: '100dvh' }}>
        <div className="flex flex-1 flex-col min-h-0 mx-auto w-full max-w-[560px]">
          {/* Area label */}
          <div className="shrink-0 px-4 pt-5 pb-3 text-center">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {currentArea.name}
            </h2>
          </div>

          {/* Duel stack */}
          <div className="flex flex-1 flex-col gap-3 min-h-0 px-4 pb-3.5">
            {favoriteSlot === 'top' ? favCard : chalCard}
            {vsBadge}
            {favoriteSlot === 'top' ? chalCard : favCard}
          </div>

          {/* Footer: progress + skip */}
          <div className="shrink-0 flex flex-col gap-3 border-t border-border bg-card px-4 py-3">
            {progressWidget}
            {skipButton(true)}
          </div>
        </div>
      </main>

      {/* ── DESKTOP LAYOUT (md and up) ───────────────────────────── */}
      <div className="hidden md:block">
        {/* Scrollable content — pb clears the fixed footer */}
        <div className="pt-32 pb-24 min-h-screen">
          <div className="mx-auto w-full max-w-[600px] px-4 pt-6 flex flex-col gap-3">
            <div className="pb-2 text-center">
              <h2 className="text-2xl font-bold text-foreground leading-tight">
                {currentArea.name}
              </h2>
            </div>
            {favoriteSlot === 'top' ? favCard : chalCard}
            {vsBadge}
            {favoriteSlot === 'top' ? chalCard : favCard}
          </div>
        </div>

        {/* Fixed full-width footer */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-6 border-t border-border bg-card px-6 py-3">
          {progressWidget}
          {skipButton(false)}
        </div>
      </div>

      {/* Skip modal */}
      {state.showingSkipOptions && (
        <SkipModal
          selectedReasons={state.selectedSkipReasons}
          skipText={skipText}
          onToggleReason={onToggleSkipReason}
          onSkipTextChange={setSkipText}
          onConfirm={() => onConfirmSkip(skipText)}
          onCancel={onToggleSkipOptions}
        />
      )}

      {/* Area transition modal */}
      {areaTransition && (
        <AreaTransitionModal omitted={areaTransition.omitted} nextName={areaTransition.nextName} />
      )}
    </>
  );
}
