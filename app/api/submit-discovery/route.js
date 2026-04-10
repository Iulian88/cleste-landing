import { NextResponse } from 'next/server'
import { getSupabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { firme, software, timp_pierdut, dureri, pret_lunar, experienta_ai, mesaj_liber } = body
    const supabase = getSupabase()
    const { error } = await supabase
      .from('discovery_responses')
      .insert([{ firme, software, timp_pierdut, dureri, pret_lunar, experienta_ai, mesaj_liber }])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
