'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FooterNavProps {
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  showPrevious?: boolean;
  showNext?: boolean;
}

export function FooterNav({
  onPrevious,
  onNext,
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  previousDisabled = false,
  nextDisabled = false,
  showPrevious = true,
  showNext = true,
}: FooterNavProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="max-w-[720px] mx-auto px-4 py-3 flex justify-between gap-3">
        {showPrevious ? (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={previousDisabled}
            className="flex-1 sm:flex-none sm:min-w-[140px] h-11"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {previousLabel}
          </Button>
        ) : (
          <div className="flex-1 sm:flex-none sm:min-w-[140px]" />
        )}
        {showNext ? (
          <Button
            onClick={onNext}
            disabled={nextDisabled}
            className="flex-1 sm:flex-none sm:min-w-[160px] h-11 text-base font-semibold"
          >
            {nextLabel}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <div className="flex-1 sm:flex-none sm:min-w-[140px]" />
        )}
      </div>
    </footer>
  );
}
