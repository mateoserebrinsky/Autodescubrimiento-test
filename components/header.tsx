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
          {[1, 2, 3].map((n) => {
            const stepState =
              n < currentSection ? 'done' : n === currentSection ? 'current' : 'upcoming';
            return (
              <div
                key={n}
                className={[
                  'flex-1 h-[30px] rounded-md flex items-center justify-center text-sm font-bold border transition-colors',
                  stepState === 'current'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : stepState === 'done'
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-secondary text-muted-foreground border-border',
                ].join(' ')}
              >
                {n}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
