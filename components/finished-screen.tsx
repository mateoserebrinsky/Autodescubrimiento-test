'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PartyPopper, RotateCcw } from 'lucide-react';

interface FinishedScreenProps {
  onRestart: () => void;
}

export function FinishedScreen({ onRestart }: FinishedScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[480px] md:max-w-[600px] space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent/10">
            <PartyPopper className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            ¡Terminaste!
          </h1>
          <p className="text-muted-foreground text-balance">
            Completaste todas las secciones del test de autoconocimiento. Tus respuestas te ayudarán a reflexionar sobre tu orientación vocacional.
          </p>
        </div>

        <Card className="bg-secondary/50 border-0">
          <CardContent className="pt-6 pb-6 space-y-4">
            <h3 className="font-semibold text-foreground text-center">
              ¿Qué sigue?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">1</span>
                <span>Reflexioná sobre tus respuestas y los patrones que descubriste.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">2</span>
                <span>Conversá con un orientador vocacional sobre tus resultados.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">3</span>
                <span>Investigá las carreras y profesiones que más te llamaron la atención.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={onRestart}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Volver a empezar
          </Button>
        </div>
      </div>
    </div>
  );
}
