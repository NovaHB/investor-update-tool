import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Target } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMetrics } from '../context/MetricsContext'

function KPICard({ label, value, change, up, icon: Icon, color }) {
  return (
    <div style={{
      background: 'white', borderRadius: 12, padding: '1.5rem',
      border: '1px solid var(--border)', flex: 1,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</p>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--black)', lineHeight: 1 }}>{value}</p>
          <p style={{
            fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: 600,
            color: up ? 'var(--green)' : 'var(--red)'
          }}>{change} this month</p>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: color + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color={color} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { metrics } = useMetrics()

  const kpis = [
    {
      label: 'MRR',
      value: `$${Number(metrics.mrr).toLocaleString()}`,
      change: metrics.mrrChange,
      up: metrics.mrrChange.startsWith('+'),
      icon: DollarSign, color: '#0066FF'
    },
    {
      label: 'Active Users',
      value: Number(metrics.activeUsers).toLocaleString(),
      change: metrics.userChange,
      up: metrics.userChange.startsWith('+'),
      icon: Users, color: '#10B981'
    },
    {
      label: 'Churn Rate',
      value: metrics.churnRate,
      change: 'this period',
      up: false,
      icon: TrendingDown, color: '#EF4444'
    },
    {
      label: 'Runway',
      value: `${metrics.runway} mo`,
      change: 'Stable',
      up: true,
      icon: Target, color: '#F59E0B'
    },
  ]

  const highlights = metrics.highlights
    ? metrics.highlights.split('\n').filter(h => h.trim())
    : []

  const asks = metrics.asks
    ? metrics.asks.split('\n').filter(a => a.trim())
    : []

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--black)' }}>Dashboard</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Monthly performance overview for investors
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{
            padding: '0.5rem 1rem', borderRadius: 8,
            border: '1px solid var(--border)', background: 'white',
            fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 500
          }}>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </button>
          <button style={{
            padding: '0.5rem 1.2rem', borderRadius: 8,
            border: 'none', background: 'var(--blue)',
            fontSize: '0.82rem', color: 'white', fontWeight: 600
          }}>Export</button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {kpis.map(kpi => <KPICard key={kpi.label} {...kpi} />)}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          background: 'white', borderRadius: 12, padding: '1.5rem',
          border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--black)' }}>MRR Growth</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Monthly recurring revenue trend</p>
            </div>
            <span style={{
              background: '#E8F5E9', color: 'var(--green)',
              fontSize: '0.75rem', fontWeight: 600,
              padding: '3px 10px', borderRadius: 20
            }}>{metrics.mrrChange} MoM</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={metrics.mrrHistory}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'MRR']} />
              <Area type="monotone" dataKey="mrr" stroke="#0066FF" strokeWidth={2.5} fill="url(#mrrGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: 'white', borderRadius: 12, padding: '1.5rem',
          border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--black)' }}>User Growth</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Total active users per month</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics.userHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="users" fill="#0066FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{
          background: 'white', borderRadius: 12, padding: '1.5rem',
          border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '1rem' }}>This Month's Highlights</p>
          {highlights.length > 0 ? highlights.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--blue)', marginTop: 5, flexShrink: 0
              }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>{item}</p>
            </div>
          )) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>No highlights yet. Fill in the Send Update form.</p>
          )}
        </div>

        <div style={{
          background: 'white', borderRadius: 12, padding: '1.5rem',
          border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <p style={{ fontWeight: 600, color: 'var(--black)', marginBottom: '1rem' }}>Investor Asks</p>
          {asks.length > 0 ? asks.map((ask, i) => (
            <div key={i} style={{
              display: 'flex', gap: '0.75rem', marginBottom: '0.9rem',
              padding: '0.75rem', background: 'var(--bg)',
              borderRadius: 8, border: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: '1.1rem' }}>🤝</span>
              <p style={{ fontSize: '0.83rem', color: 'var(--text)' }}>{ask}</p>
            </div>
          )) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>No asks yet. Fill in the Send Update form.</p>
          )}
        </div>
      </div>
    </div>
  )
}