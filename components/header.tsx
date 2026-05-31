'use client';

interface HeaderProps {
  currentSection: 1 | 2 | 3;
}

export function Header({ currentSection }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[720px] mx-auto px-4 py-3">
        <div className="text-center mb-2">
          <h1 className="text-lg font-semibold text-foreground">
            Auto-descubrimiento y Estilos
          </h1>
          <p className="text-sm text-muted-foreground">
            Orientación vocacional
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${(currentSection / 3) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Sección {currentSection} / 3
          </span>
        </div>
      </div>
    </header>
  );
}
