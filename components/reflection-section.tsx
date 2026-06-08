'use client';

import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { FooterNav } from '@/components/footer-nav';
import { MULTIPLE_CHOICE_QUESTIONS, REFLECTION_QUESTIONS } from '@/lib/data';
import type { ReflectionAnswers } from '@/lib/types';
import { Check } from 'lucide-react';

interface ReflectionSectionProps {
  currentQuestionIndex: number;
  answers: ReflectionAnswers;
  onAnswer: (questionId: keyof ReflectionAnswers, answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ReflectionSection({
  currentQuestionIndex,
  answers,
  onAnswer,
  onNext,
  onPrevious,
}: ReflectionSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const totalQuestions = MULTIPLE_CHOICE_QUESTIONS.length + REFLECTION_QUESTIONS.length;
  const isMultipleChoice = currentQuestionIndex < MULTIPLE_CHOICE_QUESTIONS.length;

  // Auto-resize textarea
  useEffect(() => {
    if (!isMultipleChoice && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  }, [answers, currentQuestionIndex, isMultipleChoice]);

  // Focus textarea on question change
  useEffect(() => {
    if (!isMultipleChoice) {
      textareaRef.current?.focus();
    }
  }, [currentQuestionIndex, isMultipleChoice]);

  const renderMultipleChoice = () => {
    const question = MULTIPLE_CHOICE_QUESTIONS[currentQuestionIndex];
    const currentAnswer = answers[question.id as keyof ReflectionAnswers] || '';

    return (
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            Pregunta {currentQuestionIndex + 1} de {totalQuestions}
          </span>
          <h2 className="text-xl font-semibold text-foreground">
            {question.title}
          </h2>
        </div>

        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = currentAnswer === option;
            return (
              <button
                key={option}
                onClick={() => onAnswer(question.id as keyof ReflectionAnswers, option)}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-secondary border-2 border-transparent hover:bg-secondary/80'
                }`}
              >
                <span className={`text-sm ${isSelected ? 'font-medium text-foreground' : 'text-secondary-foreground'}`}>
                  {option}
                </span>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    );
  };

  const renderTextQuestion = () => {
    const reflectionIndex = currentQuestionIndex - MULTIPLE_CHOICE_QUESTIONS.length;
    const question = REFLECTION_QUESTIONS[reflectionIndex];
    const currentAnswer = answers[question.id as keyof ReflectionAnswers] || '';

    return (
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            Pregunta {currentQuestionIndex + 1} de {totalQuestions}
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
          onChange={(e) => onAnswer(question.id as keyof ReflectionAnswers, e.target.value)}
          placeholder="Escribí tu respuesta aquí..."
          className="w-full min-h-[120px] p-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
        />
      </Card>
    );
  };

  return (
    <>
      <Header currentSection={3} />
      <main className="min-h-screen pt-32 pb-24 px-4">
        <div className="max-w-[480px] md:max-w-[600px] mx-auto space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, i) => (
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

          {isMultipleChoice ? renderMultipleChoice() : renderTextQuestion()}
        </div>
      </main>
      <FooterNav
        onPrevious={onPrevious}
        onNext={onNext}
        previousLabel={currentQuestionIndex === 0 ? 'Sección 2' : 'Anterior'}
        nextLabel={currentQuestionIndex === totalQuestions - 1 ? 'Finalizar' : 'Siguiente'}
      />
    </>
  );
}
