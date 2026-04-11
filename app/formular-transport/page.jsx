'use client'

import { useState } from 'react'
import './formular-transport.css'

export default function FormularTransport() {
  const [current, setCurrent] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const total = 7

  // Step 1
  const [rol, setRol] = useState('')
  // Step 2
  const [vehicule, setVehicule] = useState('')
  const [tipTransport, setTipTransport] = useState([])
  // Step 3
  const [timpPierdut, setTimpPierdut] = useState('')
  // Step 4
  const [dureri, setDureri] = useState([])
  // Step 5
  const [software, setSoftware] = useState([])
  // Step 6
  const [pret, setPret] = useState(200)
  const [decizie, setDecizie] = useState('')
  // Step 7
  const [mesaj, setMesaj] = useState('')
  const [contact, setContact] = useState('')

  const pct = Math.round(((current - 1) / total) * 100)

  function toggleCheckbox(val, setter) {
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
      const res = await fetch('/api/submit-transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rol: rol || '-',
          vehicule: vehicule || '-',
          tip_transport: tipTransport.join(', ') || '-',
          timp_pierdut: timpPierdut || '-',
          dureri: dureri.join(', ') || '-',
          software: software.join(', ') || '-',
          pret_lunar: pret,
          decizie: decizie || '-',
          mesaj_liber: mesaj || '-',
          contact: contact.trim() || '-',
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
    <div className="ft-body">
      <div className="wrap">

        {/* Header */}
        <div className="header">
          <div className="badge">Sondaj confidential · 5 minute</div>
          <h1 className="ft-h1">Spune-ne cum lucrezi<br /><span>in transport zi de zi</span></h1>
          <p className="subtitle">Construim un asistent AI pentru <strong>dispeceri si firme de transport</strong> din Romania. Raspunsurile tale decid ce automatizam primul.</p>
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

        {/* Thank you */}
        {submitted && (
          <div className="thankyou">
            <div className="check-circle">✓</div>
            <h2>Multumim mult!</h2>
            <p>Raspunsurile tale sunt extrem de valoroase. Daca ai lasat un contact, te sunăm sau scriem în maxim 48 ore.</p>
            <div style={{ marginTop: 32, padding: 20, background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)', textAlign: 'left' }}>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>Ce urmeaza:</strong>
              Analizam toate raspunsurile in 48 ore. Constructul primului modul porneste de la ce doare cel mai mult — raspunsul tau conteaza direct.
            </div>
          </div>
        )}

        {/* STEP 1 — Rol */}
        {!submitted && current === 1 && (
          <div className="step">
            <div className="section-label">Profilul tau</div>
            <div className="question">Care este rolul tau in firma?</div>
            <div className="hint">Vrem sa intelegem cu cine vorbim.</div>
            <div className="options">
              {[
                ['dispecer', 'Dispecer — coordonez soferii si cursele zilnic'],
                ['patron-dispecer', 'Patron — si fac dispecerat eu personal'],
                ['patron-echipa', 'Patron — am dispeceri angajati'],
                ['sef-dispecerat', 'Sef dispecerat / manager operational'],
              ].map(([val, label]) => (
                <label key={val} className="opt">
                  <input type="radio" name="rol" value={val} checked={rol === val} onChange={() => setRol(val)} />
                  <span className="opt-label"><span className="opt-dot"></span>{label}</span>
                </label>
              ))}
            </div>
            <div className="nav">
              <button className="btn btn-primary" onClick={goNext}>Continua &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Vehicule + Tip transport */}
        {!submitted && current === 2 && (
          <div className="step">
            <div className="section-label">Dimensiunea operatiunii</div>
            <div className="question">Cate camioane / vehicule gestionezi zilnic?</div>
            <div className="hint">Aproximativ — ne ajuta sa intelegem volumul de munca.</div>
            <div className="options cols-2">
              {[['1-3', '1–3 vehicule'], ['4-10', '4–10 vehicule'], ['11-25', '11–25 vehicule'], ['25+', 'Peste 25 vehicule']].map(([val, label]) => (
                <label key={val} className="opt">
                  <input type="radio" name="vehicule" value={val} checked={vehicule === val} onChange={() => setVehicule(val)} />
                  <span className="opt-label"><span className="opt-dot"></span>{label}</span>
                </label>
              ))}
            </div>
            <hr className="divider" />
            <div className="question" style={{ fontSize: 18 }}>Ce tip de transport faci predominant?</div>
            <div className="options cols-2">
              {[
                ['intern', 'Transport intern (Romania)'],
                ['international', 'Transport international'],
                ['marfa-risc', 'Marfa cu risc fiscal (e-Transport)'],
                ['groupaj', 'Groupaj / colete'],
              ].map(([val, label]) => (
                <label key={val} className="opt multi">
                  <input type="checkbox" name="tip_transport" value={val} checked={tipTransport.includes(val)} onChange={() => toggleCheckbox(val, setTipTransport)} />
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

        {/* STEP 3 — Timp pierdut */}
        {!submitted && current === 3 && (
          <div className="step">
            <div className="section-label">Unde pierzi cel mai mult timp</div>
            <div className="question">Care activitate iti consuma cel mai mult timp zilnic?</div>
            <div className="hint">Alege una singura — cea mai mare durere a ta.</div>
            <div className="options">
              {[
                ['cmr', 'CMR-uri — completare, verificare, arhivare, trimitere'],
                ['etransport', 'RO e-Transport — generare coduri UIT pentru fiecare cursa'],
                ['comunicare', 'Comunicare cu soferii — statusuri, probleme, documente lipsa'],
                ['facturare', 'Facturare — corelarea comenzilor cu CMR-urile si tarifele'],
                ['monitorizare', 'Monitorizare curse — unde e soferul, cand ajunge, intarzieri'],
                ['acte-camion', 'Acte camion — asigurari CMR, ITP, tahograf, expirari'],
              ].map(([val, label]) => (
                <label key={val} className="opt">
                  <input type="radio" name="timp_pierdut" value={val} checked={timpPierdut === val} onChange={() => setTimpPierdut(val)} />
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

        {/* STEP 4 — Dureri */}
        {!submitted && current === 4 && (
          <div className="step">
            <div className="section-label">Problemele reale</div>
            <div className="question">Ce situatii iti creeaza cel mai mult stres? <em style={{ fontStyle: 'normal', fontSize: 14, color: 'var(--muted)' }}>(Selecteaza toate)</em></div>
            <div className="hint">Fii sincer — raspunsul tau influenteaza direct ce vom construi.</div>
            <div className="options">
              {[
                ['cmr-gresit', 'CMR-uri completate gresit de soferi sau clienti'],
                ['uit-uitat', 'Uitat sa generezi codul UIT inainte de plecare — risc amenda'],
                ['documente-pierdute', 'Documente pierdute sau nearhivate corect'],
                ['factura-gresita', 'Facturi emise gresit din cauza tarifelor sau km incorecti'],
                ['asigurare-expirata', 'Asigurare CMR expirata descoperita prea tarziu'],
                ['whatsapp-haos', 'Totul pe WhatsApp — haos, informatii pierdute in conversatii'],
                ['clienti-neplata', 'Clienti care intarzie plata — greu de urmarit scadentele'],
                ['sofer-contact', 'Greu de contactat soferul cand e in cursa internationala'],
              ].map(([val, label]) => (
                <label key={val} className="opt multi">
                  <input type="checkbox" name="dureri" value={val} checked={dureri.includes(val)} onChange={() => toggleCheckbox(val, setDureri)} />
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

        {/* STEP 5 — Software */}
        {!submitted && current === 5 && (
          <div className="step">
            <div className="section-label">Tooluri curente</div>
            <div className="question">Ce folosesti acum pentru a gestiona cursele si documentele?</div>
            <div className="hint">Selecteaza tot ce aplici — vrem sa stim cu ce lucrezi.</div>
            <div className="options cols-2">
              {[
                ['soft-transport', 'Soft Transport'],
                ['trans-eu', 'Trans.eu / Timocom'],
                ['gps-app', 'Aplicatie GPS (Samsara, Teleroute etc.)'],
                ['excel', 'Excel / foi de calcul'],
                ['whatsapp-only', 'WhatsApp + email, fara alt soft'],
                ['spv-anaf', 'SPV ANAF manual pentru e-Transport'],
              ].map(([val, label]) => (
                <label key={val} className="opt multi">
                  <input type="checkbox" name="software" value={val} checked={software.includes(val)} onChange={() => toggleCheckbox(val, setSoftware)} />
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

        {/* STEP 6 — Pret + Decizie */}
        {!submitted && current === 6 && (
          <div className="step">
            <div className="section-label">Valoare si pret</div>
            <div className="question">Daca un tool AI ar automatiza CMR-urile, e-Transport si facturarea — cat ai plati lunar?</div>
            <div className="hint">Misca slider-ul sincer — ne ajuta enorm sa setam pretul corect.</div>
            <div className="info-box">
              <strong>Context util</strong>
              O amenda pentru cod UIT lipsa: 20.000–100.000 lei. Un dispecer costa 4.000–7.000 lei/luna. Daca toolul ii salveaza 2 ore pe zi, valoarea e clara.
            </div>
            <div className="slider-wrap">
              <div className="slider-labels"><span>0 — nu as plati</span><span>1000 lei/luna</span></div>
              <input type="range" min="0" max="1000" step="50" value={pret} onChange={e => setPret(Number(e.target.value))} />
              <div className="slider-val">{pret === 0 ? 'Nu as plati' : `${pret} lei/luna`}</div>
            </div>
            <hr className="divider" />
            <div className="question" style={{ fontSize: 18 }}>Cine ar lua decizia de cumparare in firma ta?</div>
            <div className="options">
              {[
                ['eu', 'Eu personal — decid singur'],
                ['patron', 'Trebuie sa aprobe patronul'],
                ['comun', 'Decizie comuna cu echipa'],
              ].map(([val, label]) => (
                <label key={val} className="opt">
                  <input type="radio" name="decizie" value={val} checked={decizie === val} onChange={() => setDecizie(val)} />
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

        {/* STEP 7 — Mesaj + Contact */}
        {!submitted && current === 7 && (
          <div className="step">
            <div className="section-label">Ultima intrebare</div>
            <div className="question">Descrie-ne ziua ta cea mai haotica in dispecerat — ce s-a intamplat si de ce a fost un cosmar?</div>
            <div className="hint">Scrie liber, cat vrei. Cu cat e mai concret, cu atat ne ajuta mai mult sa construim ce trebuie.</div>
            <textarea
              className="ft-textarea"
              placeholder="Ex: soferul a plecat fara codul UIT, clientul suna la fiecare ora, CMR-ul era completat gresit, am stat pana la miezul noptii sa rezolv..."
              value={mesaj}
              onChange={e => setMesaj(e.target.value)}
            />
            <div className="question" style={{ fontSize: 17 }}>Vrei sa fii primul care testeaza — gratuit?</div>
            <div className="hint">Daca da, lasa un email sau numar de telefon. Nu trimitem spam.</div>
            <textarea
              className="ft-textarea short"
              placeholder="email sau telefon (optional)"
              value={contact}
              onChange={e => setContact(e.target.value)}
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
