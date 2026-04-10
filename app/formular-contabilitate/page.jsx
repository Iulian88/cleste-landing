'use client'

import { useState } from 'react'
import './formular.css'

export default function FormularContabilitate() {
  const [current, setCurrent] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const total = 6

  const [q1, setQ1] = useState('')
  const [q2, setQ2] = useState([])
  const [q3, setQ3] = useState('')
  const [q4, setQ4] = useState([])
  const [pret, setPret] = useState(100)
  const [q5b, setQ5b] = useState('')
  const [mesaj, setMesaj] = useState('')

  const pct = Math.round(((current - 1) / total) * 100)

  function toggleCheckbox(val, state, setter) {
    setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }

  function goNext() {
    if (current < total) {
      setCurrent(c => c + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  function goPrev() {
    setCurrent(c => c - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/submit-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firma: q1 || '-',
          software: q2.join(', ') || '-',
          timp_pierdut: q3 || '-',
          dureri: q4.join(', ') || '-',
          pret_lunar: pret,
          experienta_ai: q5b || '-',
          mesaj_liber: mesaj || '-',
          sursa: 'esellroyal',
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Eroare la trimitere.')
        setSubmitting(false)
        return
      }
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Eroare de conexiune. Incearca din nou.')
      setSubmitting(false)
    }
  }

  return (
    <div className="fc-body">
      <div className="wrap">

        {/* Header */}
        <div className="header">
          <div className="badge">Sondaj confidential · 5 minute</div>
          <h1 className="fc-h1">Hai sa intelegem<br /><span>cum lucrezi cu adevarat</span></h1>
          <p className="subtitle">Construim un instrument AI pentru contabili din Romania. <strong>Raspunsurile tale</strong> decid ce construim mai intai.</p>
        </div>

        {/* Progress */}
        {!submitted && (
          <div className="progress-wrap">
            <div className="progress-meta">
              <span>{`Pasul ${current} din ${total}`}</span>
              <span>{`${pct}%`}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* Thank you screen */}
        {submitted && (
          <div className="thankyou">
            <div className="check-circle">&#10003;</div>
            <h2>Multumim mult!</h2>
            <p>Raspunsurile tale sunt extrem de valoroase. Iti vom trimite primii acces la instrument imediat ce e gata — fara spam, promis.</p>
            <div style={{ marginTop: 32, padding: 20, background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)', textAlign: 'left' }}>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>Ce urmeaza:</strong>
              Analizam raspunsurile in 48 ore. Daca esti interesat de o discutie de 20 min despre cum ar arata toolul ideal pentru tine, raspunde la emailul de confirmare.
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {!submitted && current === 1 && (
          <div className="step">
            <div className="section-label">Profilul tau</div>
            <div className="question">Cate firme-client gestionezi in prezent?</div>
            <div className="hint">Aproximativ, nu trebuie sa fie exact.</div>
            <div className="options">
              {[['1-5', '1-5 firme'], ['6-15', '6-15 firme'], ['16-30', '16-30 firme'], ['30+', 'Peste 30 firme']].map(([val, label]) => (
                <label key={val} className="opt">
                  <input type="radio" name="q1" value={val} checked={q1 === val} onChange={() => setQ1(val)} />
                  <span className="opt-label"><span className="opt-dot"></span>{label}</span>
                </label>
              ))}
            </div>
            <div className="nav">
              <button className="btn btn-primary" onClick={goNext}>Continua &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {!submitted && current === 2 && (
          <div className="step">
            <div className="section-label">Tooluri curente</div>
            <div className="question">Ce programe folosesti zilnic? <em style={{ fontStyle: 'normal', fontSize: 14, color: 'var(--muted)' }}>(Selecteaza toate)</em></div>
            <div className="hint">Vrem sa stim cu ce sa ne integram sau ce sa inlocuim.</div>
            <div className="options cols-2">
              {['SAGA', 'SmartBill', 'Ciel', 'WinMentor', 'Oblio', 'Excel'].map(val => (
                <label key={val} className="opt multi">
                  <input type="checkbox" name="q2" value={val} checked={q2.includes(val)} onChange={() => toggleCheckbox(val, q2, setQ2)} />
                  <span className="opt-label"><span className="opt-dot"></span>{val === 'Excel' ? 'Excel manual' : val}</span>
                </label>
              ))}
            </div>
            <div className="nav">
              <button className="btn btn-ghost" onClick={goPrev}>&larr; Inapoi</button>
              <button className="btn btn-primary" onClick={goNext}>Continua &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {!submitted && current === 3 && (
          <div className="step">
            <div className="section-label">Unde pierzi cel mai mult timp</div>
            <div className="question">Care activitate iti consuma cel mai mult timp saptamanal?</div>
            <div className="hint">Alege una singura — cea mai mare durere.</div>
            <div className="options">
              {[
                ['documente', 'Colectarea documentelor de la clienti (facturi, chitante, extrase)'],
                ['introducere', 'Introducerea manuala a datelor in program'],
                ['declaratii', 'Pregatirea si depunerea declaratiilor ANAF'],
                ['reconciliere', 'Reconcilierea extraselor bancare'],
                ['rapoarte', 'Rapoarte si situatii financiare pentru clienti'],
                ['saft', 'SAF-T (Declaratia 406) si e-Factura'],
              ].map(([val, label]) => (
                <label key={val} className="opt">
                  <input type="radio" name="q3" value={val} checked={q3 === val} onChange={() => setQ3(val)} />
                  <span className="opt-label"><span className="opt-dot"></span>{label}</span>
                </label>
              ))}
            </div>
            <div className="nav">
              <button className="btn btn-ghost" onClick={goPrev}>&larr; Inapoi</button>
              <button className="btn btn-primary" onClick={goNext}>Continua &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {!submitted && current === 4 && (
          <div className="step">
            <div className="section-label">Durerea reala</div>
            <div className="question">Ce problema te streseaza cel mai mult la finalul lunii?</div>
            <div className="hint">Selecteaza tot ce se aplica.</div>
            <div className="options">
              {[
                ['clienti-lenti', 'Clienti care trimit documentele in ultimul moment'],
                ['documente-incomplete', 'Documente incomplete sau gresite de la clienti'],
                ['erori-introducere', 'Erori la introducerea manuala a datelor'],
                ['termene-anaf', 'Termene ANAF strinse si declaratii multiple'],
                ['efactura', 'e-Factura / SPV — procesare si monitorizare'],
                ['comunicare', 'Comunicarea cu clientii — explicatii, reminder-e'],
              ].map(([val, label]) => (
                <label key={val} className="opt multi">
                  <input type="checkbox" name="q4" value={val} checked={q4.includes(val)} onChange={() => toggleCheckbox(val, q4, setQ4)} />
                  <span className="opt-label"><span className="opt-dot"></span>{label}</span>
                </label>
              ))}
            </div>
            <div className="nav">
              <button className="btn btn-ghost" onClick={goPrev}>&larr; Inapoi</button>
              <button className="btn btn-primary" onClick={goNext}>Continua &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {!submitted && current === 5 && (
          <div className="step">
            <div className="section-label">Deschidere fata de AI</div>
            <div className="question">Daca un tool AI ti-ar reduce munca repetitiva cu 30%, cat ai plati lunar?</div>
            <div className="hint">Misca slider-ul — raspunsul tau sincer ne ajuta enorm.</div>
            <div className="slider-wrap">
              <div className="slider-labels"><span>0 lei — nu as plati</span><span>500 lei/luna</span></div>
              <input type="range" min="0" max="500" step="25" value={pret} onChange={e => setPret(Number(e.target.value))} />
              <div className="slider-val">{pret === 0 ? 'Nu as plati' : `${pret} lei/luna`}</div>
            </div>
            <hr className="divider" />
            <div className="question" style={{ fontSize: 18, marginBottom: 8 }}>Ai mai folosit AI in munca ta?</div>
            <div className="options cols-2">
              {[
                ['da-regulat', 'Da, regulat'],
                ['da-ocazional', 'Da, ocazional'],
                ['nu-curios', 'Nu, dar sunt curios'],
                ['nu-sceptic', 'Nu, si sunt sceptic'],
              ].map(([val, label]) => (
                <label key={val} className="opt">
                  <input type="radio" name="q5b" value={val} checked={q5b === val} onChange={() => setQ5b(val)} />
                  <span className="opt-label"><span className="opt-dot"></span>{label}</span>
                </label>
              ))}
            </div>
            <div className="nav">
              <button className="btn btn-ghost" onClick={goPrev}>&larr; Inapoi</button>
              <button className="btn btn-primary" onClick={goNext}>Continua &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 6 */}
        {!submitted && current === 6 && (
          <div className="step">
            <div className="section-label">Ultima intrebare</div>
            <div className="question">Ce ar trebui sa faca un tool AI ca sa iti usureze cu adevarat munca?</div>
            <div className="hint">Scrie liber — orice iti vine in minte. Nu exista raspuns gresit.</div>
            <textarea
              className="fc-textarea"
              placeholder="Ex: sa preia automat facturile din email, sa imi aminteasca termenele, sa genereze D300..."
              value={mesaj}
              onChange={e => setMesaj(e.target.value)}
            />
            {error && <div className="error-msg">{error}</div>}
            <div className="nav">
              <button className="btn btn-ghost" onClick={goPrev}>&larr; Inapoi</button>
              <button className="btn btn-primary" onClick={goNext} disabled={submitting}>
                {submitting ? 'Se trimite...' : 'Trimite raspunsurile ✓'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
