import { NextResponse } from 'next/server'
import { getSupabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { rol, vehicule, tip_transport, timp_pierdut, dureri, software, pret_lunar, decizie, mesaj_liber, contact } = body
    const supabase = getSupabase()
    const { error } = await supabase
      .from('discovery_transport')
      .insert([{ rol, vehicule, tip_transport, timp_pierdut, dureri, software, pret_lunar, decizie, mesaj_liber, contact }])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
