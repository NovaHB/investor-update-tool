import { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'

const defaultSettings = {
  companyName: '',
  founderName: 'Novemh',
  founderRole: 'Founder & CEO',
  companyStage: 'Seed',
  industry: 'SaaS',
  senderEmail: '',
  appPassword: '',
  emailSignature: '',
}

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('investoriq_settings')
      return saved ? JSON.parse(saved) : defaultSettings
    } catch { return defaultSettings }
  })
  const [saved, setSaved] = useState(false)

  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }))

  const handleSave = () => {
    try {
      localStorage.setItem('investoriq_settings', JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {}
  }

  const inputStyle = {
    width: '100%', padding: '0.55rem 0.8rem',
    border: '1px solid var(--border)', borderRadius: 8,
    fontSize: '0.85rem', outline: 'none', color: 'var(--text)', background: 'white'
  }

  const labelStyle = {
    fontSize: '0.75rem', fontWeight: 600,
    color: 'var(--muted)', display: 'block', marginBottom: '0.3rem'
  }

  const cardStyle = {
    background: 'white', borderRadius: 12, padding: '1.5rem',
    border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    marginBottom: '1rem'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--black)' }}>Settings</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Configure your company profile and email delivery
          </p>
        </div>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1.4rem', borderRadius: 8, border: 'none',
          background: saved ? 'var(--green)' : 'var(--blue)',
          color: 'white', fontWeight: 600, fontSize: '0.88rem',
          transition: 'background 0.2s'
        }}>
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
        </button>
      </div>

      {/* Company Profile */}
      <div style={cardStyle}>
        <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>
          Company Profile
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Company Name</label>
            <input value={settings.companyName} onChange={e => update('companyName', e.target.value)}
              placeholder="Enneractlabs" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Founder Name</label>
            <input value={settings.founderName} onChange={e => update('founderName', e.target.value)}
              placeholder="Novemh" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Your Role</label>
            <input value={settings.founderRole} onChange={e => update('founderRole', e.target.value)}
              placeholder="Founder & CEO" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Company Stage</label>
            <select value={settings.companyStage} onChange={e => update('companyStage', e.target.value)}
              style={inputStyle}>
              {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Industry</label>
            <input value={settings.industry} onChange={e => update('industry', e.target.value)}
              placeholder="SaaS, Fintech, Web3..." style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Email Config */}
      <div style={cardStyle}>
        <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
          Email Delivery
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
          Used to send investor updates from your Gmail account
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Gmail Address</label>
            <input value={settings.senderEmail} onChange={e => update('senderEmail', e.target.value)}
              placeholder="you@gmail.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Gmail App Password</label>
            <input type="password" value={settings.appPassword} onChange={e => update('appPassword', e.target.value)}
              placeholder="16-character app password" style={inputStyle} />
          </div>
        </div>
        <div style={{
          background: 'var(--blue-light)', borderRadius: 8, padding: '0.75rem 1rem',
          fontSize: '0.8rem', color: 'var(--blue)', lineHeight: 1.5
        }}>
          💡 To get a Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords
        </div>
      </div>

      {/* Email Signature */}
      <div style={cardStyle}>
        <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
          Email Signature
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          Appended to the bottom of every investor update
        </p>
        <textarea
          value={settings.emailSignature}
          onChange={e => update('emailSignature', e.target.value)}
          placeholder={`Best,\nNovemh\nFounder, Enneractlabs\nnovemh@gmail.com`}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Danger Zone */}
      <div style={{
        ...cardStyle,
        border: '1px solid #FECACA',
        background: '#FFF5F5'
      }}>
        <p style={{ fontWeight: 600, color: '#C62828', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
          Danger Zone
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          Permanently clear all saved settings and data
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure? This will clear all saved data.')) {
              localStorage.clear()
              setSettings(defaultSettings)
            }
          }}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: 8,
            border: '1px solid #FECACA', background: 'white',
            color: '#C62828', fontWeight: 600, fontSize: '0.82rem',
            cursor: 'pointer'
          }}>
          Clear All Data
        </button>
      </div>
    </div>
  )
}