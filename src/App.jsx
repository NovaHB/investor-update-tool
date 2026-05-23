import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Send, Settings,
  TrendingUp, Bell, Search, ChevronDown
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Investors from './pages/Investors'
import SendUpdate from './pages/SendUpdate'
import './index.css'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Investors', icon: Users, path: '/investors' },
  { label: 'Send Update', icon: Send, path: '/send' },
]

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Sidebar */}
        <aside style={{
          width: '240px', background: 'var(--white)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          padding: '1.5rem 0', position: 'fixed',
          height: '100vh', zIndex: 100
        }}>
          {/* Logo */}
          <div style={{ padding: '0 1.5rem 2rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem'
            }}>
              <div style={{
                width: 32, height: 32, background: 'var(--blue)',
                borderRadius: 8, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <TrendingUp size={16} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--black)' }}>
                InvestorIQ
              </span>
            </div>
          </div>

          {/* Nav */}
          <div style={{ padding: '0 0.8rem', flex: 1 }}>
            <p style={{
              fontSize: '0.68rem', textTransform: 'uppercase',
              letterSpacing: '1.2px', color: 'var(--muted)',
              padding: '0 0.8rem', marginBottom: '0.5rem', fontWeight: 600
            }}>General</p>

            {navItems.map(({ label, icon: Icon, path }) => (
              <NavLink key={path} to={path} end={path === '/'} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.8rem', borderRadius: 8,
                marginBottom: '0.2rem', fontWeight: 500,
                background: isActive ? 'var(--blue-light)' : 'transparent',
                color: isActive ? 'var(--blue)' : 'var(--muted)',
                transition: 'all 0.15s'
              })}>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}

            <p style={{
              fontSize: '0.68rem', textTransform: 'uppercase',
              letterSpacing: '1.2px', color: 'var(--muted)',
              padding: '1.2rem 0.8rem 0.5rem', fontWeight: 600
            }}>Tools</p>

            <NavLink to="/settings" style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.8rem', borderRadius: 8,
              marginBottom: '0.2rem', fontWeight: 500,
              background: isActive ? 'var(--blue-light)' : 'transparent',
              color: isActive ? 'var(--blue)' : 'var(--muted)',
            })}>
              <Settings size={17} />
              Settings
            </NavLink>
          </div>

          {/* Bottom user */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--blue)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '0.8rem'
            }}>N</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--black)' }}>Novemh</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Founder</div>
            </div>
            <ChevronDown size={14} style={{ marginLeft: 'auto', color: 'var(--muted)' }} />
          </div>
        </aside>

        {/* Main content */}
        <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh' }}>
          {/* Top bar */}
          <div style={{
            height: 60, background: 'var(--white)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center',
            padding: '0 2rem', gap: '1rem',
            position: 'sticky', top: 0, zIndex: 50
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '0.4rem 0.8rem', flex: 1, maxWidth: 400
            }}>
              <Search size={14} color="var(--muted)" />
              <input placeholder="Search..." style={{
                border: 'none', background: 'transparent',
                outline: 'none', fontSize: '0.85rem', color: 'var(--text)', width: '100%'
              }} />
            </div>
            <Bell size={18} color="var(--muted)" style={{ marginLeft: 'auto' }} />
          </div>

          {/* Page content */}
          <div style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/send" element={<SendUpdate />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}