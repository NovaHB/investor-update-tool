import { useState } from 'react'
import { Mail, Plus, Trash2, Edit3 } from 'lucide-react'

const initialInvestors = [
  { id: 1, name: 'Sarah Chen', firm: 'Sequoia Capital', email: 'sarah@sequoia.com', interest: 85, status: 'Active', tier: 'Lead' },
  { id: 2, name: 'Marcus Williams', firm: 'a16z', email: 'marcus@a16z.com', interest: 72, status: 'Warm', tier: 'Follow-on' },
  { id: 3, name: 'Priya Patel', firm: 'YC Alumni Fund', email: 'priya@ycfund.com', interest: 60, status: 'Warm', tier: 'Angel' },
  { id: 4, name: 'James Okafor', firm: 'TechStars', email: 'james@techstars.com', interest: 45, status: 'Cold', tier: 'Angel' },
  { id: 5, name: 'Elena Rossi', firm: 'Index Ventures', email: 'elena@indexventures.com', interest: 30, status: 'Cold', tier: 'Prospect' },
]

function InterestMeter({ value }) {
  const color = value >= 70 ? '#10B981' : value >= 45 ? '#F59E0B' : '#EF4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{
        flex: 1, height: 6, background: '#F3F4F6',
        borderRadius: 10, overflow: 'hidden'
      }}>
        <div style={{
          width: `${value}%`, height: '100%',
          background: color, borderRadius: 10,
          transition: 'width 0.4s ease'
        }} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color, minWidth: 30 }}>{value}%</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Active:   { bg: '#E8F5E9', color: '#2E7D32' },
    Warm:     { bg: '#FFF3E0', color: '#E65100' },
    Cold:     { bg: '#F5F5F5', color: '#616161' },
  }
  const s = styles[status] || styles.Cold
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: '0.72rem', fontWeight: 600
    }}>{status}</span>
  )
}

export default function Investors() {
  const [investors, setInvestors] = useState(initialInvestors)
  const [selected, setSelected] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', firm: '', email: '', interest: 50, status: 'Cold', tier: 'Prospect' })

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const toggleAll = () => {
    setSelected(selected.length === investors.length ? [] : investors.map(i => i.id))
  }

  const addInvestor = () => {
    if (!form.name || !form.email) return
    setInvestors(prev => [...prev, { ...form, id: Date.now(), interest: Number(form.interest) }])
    setForm({ name: '', firm: '', email: '', interest: 50, status: 'Cold', tier: 'Prospect' })
    setShowForm(false)
  }

  const deleteInvestor = (id) => setInvestors(prev => prev.filter(i => i.id !== id))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--black)' }}>Investors</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Manage your investor list and track engagement levels
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {selected.length > 0 && (
            <button style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1.2rem', borderRadius: 8,
              border: 'none', background: 'var(--blue)',
              fontSize: '0.82rem', color: 'white', fontWeight: 600
            }}>
              <Mail size={14} />
              Send Update ({selected.length})
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1.2rem', borderRadius: 8,
              border: '1px solid var(--border)', background: 'white',
              fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600
            }}>
            <Plus size={14} />
            Add Investor
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{
          background: 'white', borderRadius: 12, padding: '1.5rem',
          border: '1px solid var(--border)', marginBottom: '1.5rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--black)' }}>Add New Investor</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { label: 'Full Name', key: 'name', placeholder: 'Sarah Chen' },
              { label: 'Firm', key: 'firm', placeholder: 'Sequoia Capital' },
              { label: 'Email', key: 'email', placeholder: 'sarah@sequoia.com' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                <input
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{
                    width: '100%', padding: '0.5rem 0.75rem',
                    border: '1px solid var(--border)', borderRadius: 8,
                    fontSize: '0.85rem', outline: 'none', color: 'var(--text)'
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Interest Level ({form.interest}%)</label>
              <input type="range" min="0" max="100" value={form.interest}
                onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.85rem' }}>
                {['Active', 'Warm', 'Cold'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Tier</label>
              <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.85rem' }}>
                {['Lead', 'Follow-on', 'Angel', 'Prospect'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={addInvestor} style={{
              padding: '0.5rem 1.2rem', borderRadius: 8, border: 'none',
              background: 'var(--blue)', color: 'white', fontWeight: 600, fontSize: '0.82rem'
            }}>Add Investor</button>
            <button onClick={() => setShowForm(false)} style={{
              padding: '0.5rem 1.2rem', borderRadius: 8,
              border: '1px solid var(--border)', background: 'white',
              color: 'var(--muted)', fontWeight: 600, fontSize: '0.82rem'
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        background: 'white', borderRadius: 12,
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '40px 2fr 1.5fr 2fr 1.5fr 1fr 1fr 80px',
          padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border)',
          background: 'var(--bg)'
        }}>
          <input type="checkbox" checked={selected.length === investors.length}
            onChange={toggleAll} style={{ cursor: 'pointer' }} />
          {['Name', 'Firm', 'Email', 'Interest', 'Tier', 'Status', ''].map(h => (
            <span key={h} style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {investors.map((inv, i) => (
          <div key={inv.id} style={{
            display: 'grid', gridTemplateColumns: '40px 2fr 1.5fr 2fr 1.5fr 1fr 1fr 80px',
            padding: '1rem 1.5rem', borderBottom: i < investors.length - 1 ? '1px solid var(--border)' : 'none',
            alignItems: 'center', background: selected.includes(inv.id) ? '#F0F5FF' : 'white',
            transition: 'background 0.15s'
          }}>
            <input type="checkbox" checked={selected.includes(inv.id)}
              onChange={() => toggleSelect(inv.id)} style={{ cursor: 'pointer' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--blue-light)', color: 'var(--blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.78rem', flexShrink: 0
              }}>{inv.name.charAt(0)}</div>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--black)' }}>{inv.name}</span>
            </div>

            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{inv.firm}</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{inv.email}</span>
            <InterestMeter value={inv.interest} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>{inv.tier}</span>
            <StatusBadge status={inv.status} />

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => deleteInvestor(inv.id)} style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted)', cursor: 'pointer'
              }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
        {selected.length > 0 ? `${selected.length} investor(s) selected` : `${investors.length} investors total`}
      </p>
    </div>
  )
}