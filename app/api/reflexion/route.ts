import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { MULTIPLE_CHOICE_QUESTIONS, REFLECTION_QUESTIONS } from '@/lib/data';
import type { ReflectionAnswers } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { sesionId, answers }: { sesionId: string; answers: ReflectionAnswers } = await request.json();

    if (!sesionId || !answers) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Insert multiple choice answers
    const mcInserts = MULTIPLE_CHOICE_QUESTIONS.map((q, index) => ({
      sesion_id: sesionId,
      pregunta_numero: index + 1,
      pregunta_texto: q.title,
      respuesta: answers[q.id as keyof ReflectionAnswers] ?? '',
    }));

    const { error: mcError } = await supabase.from('reflexion_multiple_choice').insert(mcInserts);
    if (mcError) {
      console.error('[api/reflexion] Error insertando multiple choice:', mcError);
      return NextResponse.json({ error: 'Error guardando multiple choice' }, { status: 500 });
    }

    // Insert open-ended reflection answers
    const openInserts = REFLECTION_QUESTIONS.map((q) => ({
      sesion_id: sesionId,
      campo: q.id,
      respuesta: answers[q.id as keyof ReflectionAnswers] ?? '',
    }));

    const { error: openError } = await supabase.from('reflexion_abierta').insert(openInserts);
    if (openError) {
      console.error('[api/reflexion] Error insertando reflexion abierta:', openError);
      return NextResponse.json({ error: 'Error guardando reflexion abierta' }, { status: 500 });
    }

    // Mark session as complete
    const { error: sesionError } = await supabase
      .from('sesiones')
      .update({ completada: true })
      .eq('id', sesionId);

    if (sesionError) {
      console.error('[api/reflexion] Error marcando sesion como completada:', sesionError);
      return NextResponse.json({ error: 'Error actualizando sesion' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/reflexion] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
