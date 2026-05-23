import { useState } from 'react'
import { useMetrics, defaultMetrics } from '../context/MetricsContext'
import { Send, CheckCircle } from 'lucide-react'

const investors = [
  { id: 1, name: 'Sarah Chen', firm: 'Sequoia Capital', email: 'sarah@sequoia.com', interest: 85 },
  { id: 2, name: 'Marcus Williams', firm: 'a16z', email: 'marcus@a16z.com', interest: 72 },
  { id: 3, name: 'Priya Patel', firm: 'YC Alumni Fund', email: 'priya@ycfund.com', interest: 60 },
  { id: 4, name: 'James Okafor', firm: 'TechStars', email: 'james@techstars.com', interest: 45 },
  { id: 5, name: 'Elena Rossi', firm: 'Index Ventures', email: 'elena@indexventures.com', interest: 30 },
]

const emptyMetrics = {
  mrr: '', mrrChange: '', activeUsers: '', userChange: '',
  churnRate: '', runway: '', cashPosition: '', burnRate: '',
  highlights: '', challenges: '', nextMonth: '', asks: ''
}

export default function SendUpdate() {
const { metrics: savedMetrics, updateMetrics } = useMetrics()
const [metrics, setMetrics] = useState({ ...defaultMetrics, ...savedMetrics })
const [selected, setSelected] = useState([])
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [step, setStep] = useState(1)

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const update = (key, val) => setMetrics(m => ({ ...m, [key]: val }))

  const generateReport = async () => {
	updateMetrics(metrics)
    setLoading(true)
    try {
      const prompt = `You are writing a monthly investor update for a startup founder.

Based on these metrics, write a professional, concise investor update email:

MRR: ${metrics.mrr} (${metrics.mrrChange} MoM)
Active Users: ${metrics.activeUsers} (${metrics.userChange} MoM)
Churn Rate: ${metrics.churnRate}
Runway: ${metrics.runway} months
Cash Position: ${metrics.cashPosition}
Burn Rate: ${metrics.burnRate}/month

Key Highlights this month:
${metrics.highlights}

Challenges:
${metrics.challenges}

Focus for next month:
${metrics.nextMonth}

Asks from investors:
${metrics.asks}

Write a warm, professional investor update. Structure it as:
- Subject line (on first line, prefixed with "Subject: ")
- Brief greeting
- Performance snapshot with key numbers
- Highlights
- Challenges (be honest but confident)
- Next month focus
- Asks
- Closing

Keep it under 400 words. Write like a founder, not a consultant.`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      })

      const data = await response.json()
      setReport(data.content[0].text)
      setStep(3)
    } catch (err) {
      setReport('Could not generate report. Please check your connection and try again.')
    }
    setLoading(false)
  }

  const handleSend = () => {
    setSent(true)
    setTimeout(() => { setSent(false); setStep(1); setReport(''); setMetrics(emptyMetrics); setSelected([]) }, 3000)
  }

  const inputStyle = {
    width: '100%', padding: '0.55rem 0.8rem',
    border: '1px solid var(--border)', borderRadius: 8,
    fontSize: '0.85rem', outline: 'none', color: 'var(--text)',
    background: 'white'
  }

  const labelStyle = {
    fontSize: '0.75rem', fontWeight: 600,
    color: 'var(--muted)', display: 'block', marginBottom: '0.3rem'
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--black)' }}>Send Update</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Fill in your metrics, generate an AI update, and send to selected investors
        </p>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {['Enter Metrics', 'Select Investors', 'Review & Send'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
              background: step > i + 1 ? 'var(--green)' : step === i + 1 ? 'var(--blue)' : 'var(--border)',
              color: step >= i + 1 ? 'white' : 'var(--muted)'
            }}>{step > i + 1 ? '✓' : i + 1}</div>
            <span style={{ fontSize: '0.82rem', fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--black)' : 'var(--muted)' }}>{s}</span>
            {i < 2 && <div style={{ width: 32, height: 1, background: 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Metrics */}
      {step === 1 && (
        <div style={{
          background: 'white', borderRadius: 12, padding: '1.5rem',
          border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '1.2rem' }}>This Month's Metrics</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { label: 'MRR ($)', key: 'mrr', placeholder: '24000' },
              { label: 'MRR Change', key: 'mrrChange', placeholder: '+14.3%' },
              { label: 'Active Users', key: 'activeUsers', placeholder: '520' },
              { label: 'User Change', key: 'userChange', placeholder: '+26.8%' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input value={metrics[key]} onChange={e => update(key, e.target.value)}
                  placeholder={placeholder} style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { label: 'Churn Rate', key: 'churnRate', placeholder: '2.4%' },
              { label: 'Runway (months)', key: 'runway', placeholder: '18' },
              { label: 'Cash Position ($)', key: 'cashPosition', placeholder: '450000' },
              { label: 'Burn Rate ($/mo)', key: 'burnRate', placeholder: '25000' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input value={metrics[key]} onChange={e => update(key, e.target.value)}
                  placeholder={placeholder} style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { label: 'Key Highlights', key: 'highlights', placeholder: 'Closed 3 enterprise deals, launched v2.0...' },
              { label: 'Challenges', key: 'challenges', placeholder: 'CAC increased slightly, hiring slower than planned...' },
              { label: 'Next Month Focus', key: 'nextMonth', placeholder: 'Expand to 3 new markets, close Series A...' },
              { label: 'Asks from Investors', key: 'asks', placeholder: 'Need 2 intros to fintech VCs, advice on pricing...' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <textarea value={metrics[key]} onChange={e => update(key, e.target.value)}
                  placeholder={placeholder} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            ))}
          </div>

          <button onClick={() => setStep(2)} style={{
            padding: '0.6rem 1.5rem', borderRadius: 8, border: 'none',
            background: 'var(--blue)', color: 'white', fontWeight: 600, fontSize: '0.88rem'
          }}>Continue →</button>
        </div>
      )}

      {/* Step 2 — Select Investors */}
      {step === 2 && (
        <div style={{
          background: 'white', borderRadius: 12, padding: '1.5rem',
          border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '1.2rem' }}>Select Recipients</p>

          {investors.map(inv => (
            <div key={inv.id} onClick={() => toggleSelect(inv.id)} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.9rem 1rem', borderRadius: 8, marginBottom: '0.5rem',
              border: `1.5px solid ${selected.includes(inv.id) ? 'var(--blue)' : 'var(--border)'}`,
              background: selected.includes(inv.id) ? 'var(--blue-light)' : 'var(--bg)',
              cursor: 'pointer', transition: 'all 0.15s'
            }}>
              <input type="checkbox" checked={selected.includes(inv.id)} onChange={() => {}} style={{ cursor: 'pointer' }} />
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--blue)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.8rem', flexShrink: 0
              }}>{inv.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--black)' }}>{inv.name}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{inv.firm} · {inv.email}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 80, height: 5, background: '#F3F4F6', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{
                    width: `${inv.interest}%`, height: '100%', borderRadius: 10,
                    background: inv.interest >= 70 ? '#10B981' : inv.interest >= 45 ? '#F59E0B' : '#EF4444'
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)' }}>{inv.interest}%</span>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem' }}>
            <button onClick={() => setStep(1)} style={{
              padding: '0.6rem 1.2rem', borderRadius: 8,
              border: '1px solid var(--border)', background: 'white',
              color: 'var(--muted)', fontWeight: 600, fontSize: '0.88rem'
            }}>← Back</button>
            <button onClick={generateReport} disabled={selected.length === 0 || loading} style={{
              padding: '0.6rem 1.5rem', borderRadius: 8, border: 'none',
              background: selected.length === 0 ? 'var(--border)' : 'var(--blue)',
              color: selected.length === 0 ? 'var(--muted)' : 'white',
              fontWeight: 600, fontSize: '0.88rem', cursor: selected.length === 0 ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Generating...' : `Generate Report for ${selected.length} investor(s) →`}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Review & Send */}
      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: '1.5rem',
            border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '1rem' }}>Generated Update</p>
            <textarea value={report} onChange={e => setReport(e.target.value)} rows={18}
              style={{
                width: '100%', padding: '1rem', border: '1px solid var(--border)',
                borderRadius: 8, fontSize: '0.85rem', lineHeight: 1.6,
                color: 'var(--text)', outline: 'none', resize: 'vertical', background: 'var(--bg)'
              }} />
          </div>

          <div>
            <div style={{
              background: 'white', borderRadius: 12, padding: '1.5rem',
              border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              marginBottom: '1rem'
            }}>
              <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '1rem' }}>
                Recipients ({selected.length})
              </p>
              {investors.filter(i => selected.includes(i.id)).map(inv => (
                <div key={inv.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0', borderBottom: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--blue-light)', color: 'var(--blue)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.75rem'
                  }}>{inv.name.charAt(0)}</div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--black)' }}>{inv.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{inv.email}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => setStep(2)} style={{
                padding: '0.6rem 1.2rem', borderRadius: 8,
                border: '1px solid var(--border)', background: 'white',
                color: 'var(--muted)', fontWeight: 600, fontSize: '0.88rem'
              }}>← Back</button>

              {sent ? (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '0.8rem', borderRadius: 8,
                  background: '#E8F5E9', color: 'var(--green)', fontWeight: 600
                }}>
                  <CheckCircle size={16} /> Update Sent!
                </div>
              ) : (
                <button onClick={handleSend} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: 8,
                  border: 'none', background: 'var(--blue)',
                  color: 'white', fontWeight: 600, fontSize: '0.88rem'
                }}>
                  <Send size={15} />
                  Send to {selected.length} Investor(s)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}