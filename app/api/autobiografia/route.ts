import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { AUTOBIOGRAPHY_QUESTIONS } from '@/lib/data';
import type { AutobiographyAnswers } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { sesionId, answers }: { sesionId: string; answers: AutobiographyAnswers } = await request.json();

    if (!sesionId || !answers) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const inserts = AUTOBIOGRAPHY_QUESTIONS.map((q, index) => ({
      sesion_id: sesionId,
      pregunta_numero: index + 1,
      pregunta_titulo: q.title,
      respuesta: answers[q.id as keyof AutobiographyAnswers] ?? '',
    }));

    const { error } = await supabase.from('autobiografia_respuestas').insert(inserts);

    if (error) {
      console.error('[api/autobiografia] Error insertando respuestas:', error);
      return NextResponse.json({ error: 'Error guardando autobiografia' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/autobiografia] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
