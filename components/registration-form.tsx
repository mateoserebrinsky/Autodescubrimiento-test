'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRound, Loader2 } from 'lucide-react';
import type { UserInfo } from '@/lib/types';

interface RegistrationFormProps {
  onConfirm: (userInfo: UserInfo) => Promise<void>;
  onBack: () => void;
}

export function RegistrationForm({ onConfirm, onBack }: RegistrationFormProps) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = nombre.trim() !== '' && apellido.trim() !== '' && edad.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);
    try {
      await onConfirm({ nombre: nombre.trim(), apellido: apellido.trim(), edad: edad.trim() });
    } catch {
      setError('Hubo un problema al guardar tus datos. Intentá de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[480px] md:max-w-[600px] space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <UserRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
            Antes de empezar
          </h1>
          <p className="text-muted-foreground text-balance">
            Necesitamos algunos datos para personalizar tu experiencia.
          </p>
        </div>

        <Card className="bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tus datos</CardTitle>
            <CardDescription>Esta información es confidencial y solo se usa con fines de orientación.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={loading}
                  autoComplete="given-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Tu apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  disabled={loading}
                  autoComplete="family-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input
                  id="edad"
                  type="number"
                  placeholder="Tu edad"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  disabled={loading}
                  min={10}
                  max={99}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={loading}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Comenzar'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
