'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Trophy, SkipForward, Check, X } from 'lucide-react';
import { TALENT_AREAS, SKIP_REASONS } from '@/lib/data';
import type { AppState } from '@/lib/types';

interface TalentDuelsProps {
  state: AppState['section1'];
  onSelectWinner: (winner: string) => void;
  onNextArea: () => void;
  onToggleSkipOptions: () => void;
  onToggleSkipReason: (reason: string) => void;
  onConfirmSkip: () => void;
}

export function TalentDuels({
  state,
  onSelectWinner,
  onNextArea,
  onToggleSkipOptions,
  onToggleSkipReason,
  onConfirmSkip,
}: TalentDuelsProps) {
  const currentArea = TALENT_AREAS[state.currentAreaIndex];
  const totalDuels = currentArea.talents.length - 1;
  const currentDuel = Math.min(state.currentDuelIndex + 1, totalDuels);

  if (state.showingLeaderboard) {
    const rankings = state.areaResults[state.areaResults.length - 1]?.rankings || [];
    
    return (
      <>
        <Header currentSection={1} />
        <main className="min-h-screen pt-24 pb-24 px-4">
          <div className="max-w-[480px] md:max-w-[600px] mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10">
                <Trophy className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Ranking: {currentArea.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Tus talentos ordenados por victorias
              </p>
            </div>

            <Card className="p-4 space-y-2">
              {rankings.map((item, index) => (
                <div
                  key={item.talent}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    index === 0 
                      ? 'bg-accent/10 border border-accent/20' 
                      : index < 3 
                        ? 'bg-secondary' 
                        : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index === 0 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`text-sm ${index === 0 ? 'font-medium' : ''}`}>
                      {item.talent}
                    </span>
                  </div>
                  <Badge variant={index === 0 ? 'default' : 'secondary'} className="text-xs">
                    {item.wins} {item.wins === 1 ? 'victoria' : 'victorias'}
                  </Badge>
                </div>
              ))}
            </Card>

            <Button onClick={onNextArea} className="w-full" size="lg">
              {state.currentAreaIndex < TALENT_AREAS.length - 1 
                ? 'Siguiente área'
                : 'Continuar a Sección 2'
              }
            </Button>
          </div>
        </main>
      </>
    );
  }

  if (state.showingSkipOptions) {
    return (
      <>
        <Header currentSection={1} />
        <main className="min-h-screen pt-24 pb-24 px-4">
          <div className="max-w-[480px] md:max-w-[600px] mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                ¿Por qué querés omitir esta área?
              </h2>
              <p className="text-sm text-muted-foreground">
                Seleccioná los motivos (podés elegir varios)
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {SKIP_REASONS.map((reason) => {
                const isSelected = state.selectedSkipReasons.includes(reason);
                return (
                  <button
                    key={reason}
                    onClick={() => onToggleSkipReason(reason)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 inline mr-1" />}
                    {reason}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onToggleSkipOptions}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                onClick={onConfirmSkip}
                disabled={state.selectedSkipReasons.length === 0}
                className="flex-1"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const challenger = state.remainingChallengers[0];

  return (
    <>
      <Header currentSection={1} />
      <main className="min-h-screen pt-24 pb-24 px-4">
        <div className="max-w-[480px] md:max-w-[600px] mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="mb-2">
              {currentArea.name}
            </Badge>
            <h2 className="text-lg font-semibold text-foreground">
              ¿En qué te sentís MÁS capaz?
            </h2>
            <p className="text-xs text-muted-foreground">
              Duelo {currentDuel} de {totalDuels}
            </p>
          </div>

          {/* Duel Cards */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Champion */}
            <button
              onClick={() => onSelectWinner(state.champion!)}
              className="flex-1 group"
            >
              <Card className="p-6 h-full transition-all hover:shadow-lg hover:border-primary/50 group-focus:ring-2 group-focus:ring-primary group-focus:ring-offset-2">
                <div className="flex flex-col items-center justify-center min-h-[100px] text-center">
                  <span className="text-base font-medium text-foreground">
                    {state.champion}
                  </span>
                </div>
              </Card>
            </button>

            {/* VS indicator */}
            <div className="flex items-center justify-center py-2 md:py-0">
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-bold">
                VS
              </span>
            </div>

            {/* Challenger */}
            <button
              onClick={() => onSelectWinner(challenger)}
              className="flex-1 group"
            >
              <Card className="p-6 h-full transition-all hover:shadow-lg hover:border-primary/50 group-focus:ring-2 group-focus:ring-primary group-focus:ring-offset-2">
                <div className="flex flex-col items-center justify-center min-h-[100px] text-center">
                  <span className="text-base font-medium text-foreground">
                    {challenger}
                  </span>
                </div>
              </Card>
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: totalDuels }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < state.currentDuelIndex
                    ? 'bg-primary'
                    : i === state.currentDuelIndex
                      ? 'bg-primary/50'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Skip button */}
          <div className="text-center">
            <button
              onClick={onToggleSkipOptions}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <SkipForward className="w-4 h-4" />
              Omitir esta área
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
