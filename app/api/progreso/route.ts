import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import type { ProgressSnapshot } from '@/lib/types';

// GET /api/progreso?sesionId=123
// Returns the last saved progress snapshot for a session, or { progreso: null }
// if the orientado hasn't started (or nothing was saved yet).
export async function GET(request: NextRequest) {
  try {
    const sesionId = request.nextUrl.searchParams.get('sesionId');

    if (!sesionId) {
      return NextResponse.json({ error: 'Falta sesionId' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from('progreso_sesion')
      .select('pantalla_actual, seccion_actual, porcentaje_avance, estado, iniciado_en, actualizado_en')
      .eq('sesion_id', sesionId)
      .maybeSingle();

    if (error) {
      console.error('[api/progreso] Error obteniendo progreso:', error);
      return NextResponse.json({ error: 'Error obteniendo progreso' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ progreso: null });
    }

    return NextResponse.json({
      progreso: {
        pantallaActual: data.pantalla_actual,
        seccionActual: data.seccion_actual,
        porcentajeAvance: data.porcentaje_avance,
        estado: data.estado,
        iniciadoEn: data.iniciado_en,
        actualizadoEn: data.actualizado_en,
      },
    });
  } catch (err) {
    console.error('[api/progreso] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST /api/progreso
// Upserts (insert or update) the current progress snapshot for a session.
// Auto-saved continuously by the client as the orientado answers/navigates, so
// quitting and returning restores exactly where they left off.
//
// `iniciado_en` is intentionally left out of the payload: on first insert the
// column default (now()) sets it, and on later updates it's left untouched —
// giving us a real "fecha de inicio" plus an "última modificación" (handled by
// the actualizado_en trigger / column default).
export async function POST(request: NextRequest) {
  try {
    const {
      sesionId,
      snapshot,
      porcentajeAvance,
    }: { sesionId: string | number; snapshot: ProgressSnapshot; porcentajeAvance: number } = await request.json();

    if (!sesionId || !snapshot) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const { error } = await supabase
      .from('progreso_sesion')
      .upsert(
        {
          sesion_id: sesionId,
          pantalla_actual: snapshot.currentScreen,
          seccion_actual: snapshot.currentSection,
          porcentaje_avance: porcentajeAvance ?? 0,
          estado: snapshot,
        },
        { onConflict: 'sesion_id' },
      );

    if (error) {
      console.error('[api/progreso] Error guardando progreso:', error);
      return NextResponse.json({ error: 'Error guardando progreso' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/progreso] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
