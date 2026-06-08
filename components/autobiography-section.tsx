'use client';

import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { FooterNav } from '@/components/footer-nav';
import { AUTOBIOGRAPHY_QUESTIONS } from '@/lib/data';
import type { AutobiographyAnswers } from '@/lib/types';

interface AutobiographySectionProps {
  currentQuestionIndex: number;
  answers: AutobiographyAnswers;
  onAnswer: (questionId: keyof AutobiographyAnswers, answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function AutobiographySection({
  currentQuestionIndex,
  answers,
  onAnswer,
  onNext,
  onPrevious,
}: AutobiographySectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const question = AUTOBIOGRAPHY_QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[question.id as keyof AutobiographyAnswers] || '';

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  }, [currentAnswer]);

  // Focus textarea on question change
  useEffect(() => {
    textareaRef.current?.focus();
  }, [currentQuestionIndex]);

  return (
    <>
      <Header currentSection={2} />
      <main className="min-h-screen pt-32 pb-24 px-4">
        <div className="max-w-[480px] md:max-w-[600px] mx-auto space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-center gap-1.5">
            {AUTOBIOGRAPHY_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < currentQuestionIndex
                    ? 'bg-primary'
                    : i === currentQuestionIndex
                      ? 'bg-primary/50'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                Pregunta {currentQuestionIndex + 1} de {AUTOBIOGRAPHY_QUESTIONS.length}
              </span>
              <h2 className="text-xl font-semibold text-foreground">
                {question.title}
              </h2>
              <p className="text-muted-foreground">
                {question.prompt}
              </p>
            </div>

            <textarea
              ref={textareaRef}
              value={currentAnswer}
              onChange={(e) => onAnswer(question.id as keyof AutobiographyAnswers, e.target.value)}
              placeholder="Escribí tu respuesta aquí..."
              className="w-full min-h-[120px] p-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
            />
          </Card>
        </div>
      </main>
      <FooterNav
        onPrevious={onPrevious}
        onNext={onNext}
        previousLabel={currentQuestionIndex === 0 ? 'Sección 1' : 'Anterior'}
        nextLabel={currentQuestionIndex === AUTOBIOGRAPHY_QUESTIONS.length - 1 ? 'Sección 3' : 'Siguiente'}
      />
    </>
  );
}
