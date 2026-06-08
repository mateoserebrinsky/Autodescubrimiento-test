'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Target, BookOpen, Compass } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-120 md:max-w-150 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-5 rounded-2xl bg-primary/10 mb-2">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
            Auto-descubrimiento y Estilos
          </h1>
          <p className="text-muted-foreground text-balance">
            Te vamos a guiar en un recorrido para conocerte mejor y explorar tus intereses vocacionales.
          </p>
        </div>

        <div className="space-y-3">
          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-5 rounded-xl bg-primary/10">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Sección 1: Duelos de Talentos</CardTitle>
                  <CardDescription>Descubrí en qué te destacás</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-5 rounded-xl bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Sección 2: Autobiografía</CardTitle>
                  <CardDescription>Contanos sobre vos</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-5 rounded-xl bg-accent/10">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-base">Sección 3: Reflexión</CardTitle>
                  <CardDescription>Pensá en tu futuro</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Button 
          onClick={onStart}
          size="lg"
          className="w-full text-base font-medium"
        >
          Comenzar
        </Button>
      </div>
    </div>
  );
}
