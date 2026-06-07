import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { nombre, apellido, edad } = await request.json();

    if (!nombre || !apellido || !edad) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Create user record
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .insert({ nombre, apellido, edad: parseInt(edad, 10) })
      .select('id')
      .single();

    if (usuarioError) {
      console.error('[api/registro] Error creando usuario:', usuarioError);
      return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
    }

    // Create session record
    const { data: sesion, error: sesionError } = await supabase
      .from('sesiones')
      .insert({ usuario_id: usuario.id, completada: false })
      .select('id')
      .single();

    if (sesionError) {
      console.error('[api/registro] Error creando sesion:', sesionError);
      return NextResponse.json({ error: 'Error al crear sesion' }, { status: 500 });
    }

    return NextResponse.json({ sesionId: sesion.id });
  } catch (err) {
    console.error('[api/registro] Error inesperado:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
