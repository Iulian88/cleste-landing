import { getSupabase } from '../../lib/supabase'

export const revalidate = 0

async function getResponses() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('discovery_responses')
    .select('firma, software, timp_pierdut, pret_lunar, mesaj_liber, created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export default async function AdminPage() {
  const rows = await getResponses()

  return (
    <div style={{ padding: '32px', fontFamily: 'monospace', fontSize: 13 }}>
      <h1 style={{ marginBottom: 8 }}>Discovery Responses</h1>
      <p style={{ marginBottom: 24, color: '#666' }}>{rows.length} intrari</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
              {['firma', 'software', 'timp_pierdut', 'pret_lunar', 'mesaj_liber', 'created_at'].map(col => (
                <th key={col} style={{ padding: '8px 12px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={td}>{row.firma}</td>
                <td style={td}>{row.software}</td>
                <td style={td}>{row.timp_pierdut}</td>
                <td style={td}>{row.pret_lunar}</td>
                <td style={{ ...td, maxWidth: 320, whiteSpace: 'normal' }}>{row.mesaj_liber}</td>
                <td style={td}>{new Date(row.created_at).toLocaleString('ro-RO')}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#999' }}>
                  Nicio intrare inca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const td = {
  padding: '7px 12px',
  border: '1px solid #ddd',
  whiteSpace: 'nowrap',
  verticalAlign: 'top',
}
