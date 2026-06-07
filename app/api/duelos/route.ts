import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { TALENT_AREAS } from '@/lib/data';
import type { AreaResult } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { sesionId, areaResults }: { sesionId: string; areaResults: AreaResult[] } = await request.json();

    if (!sesionId || !areaResults) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Build inserts for duelos_resultados and duelos_omisiones
    const resultadosInserts: object[] = [];
    const omisionesInserts: object[] = [];

    for (const result of areaResults) {
      const area = TALENT_AREAS.find((a) => a.id === result.areaId);
      const areaNombre = area?.name ?? result.areaId;

      if (result.skipped) {
        omisionesInserts.push({
          sesion_id: sesionId,
          area_id: result.areaId,
          area_nombre: areaNombre,
          razones: result.skipReasons ?? [],
          razon_libre: result.skipText ?? null,
        });
      } else {
        for (let i = 0; i < result.rankings.length; i++) {
          const { talent, wins } = result.rankings[i];
          resultadosInserts.push({
            sesion_id: sesionId,
            area_id: result.areaId,
            area_nombre: areaNombre,
            item: talent,
            victorias: wins,
            posicion_ranking: i + 1,
          });
        }
      }
    }

    if (resultadosInserts.length > 0) {
      const { error } = await supabase.from('duelos_resultados').insert(resultadosInserts);
      if (error) {
        console.error('[api/duelos] Error insertando resultados:', error);
        return NextResponse.json({ error: 'Error guardando resultados' }, { status: 500 });
      }
    }

    if (omisionesInserts.length > 0) {
      const { error } = await supabase.from('duelos_omisiones').insert(omisionesInserts);
      if (error) {
        console.error('[api/duelos] Error insertando omisiones:', error);
        return NextResponse.json({ error: 'Error guardando omisiones' }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/duelos] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
